import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import EmployeeItemCard from './EmployeeItemCard';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_EMPLOYEE, PUT_EMPLOYEE_STATE } from '../../../_shared/graphql/mutations/EmployeeMutations';
import { GET_EMPLOYEES } from '../../../_shared/graphql/queries/EmployeeQueries';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';
import EmployeeFilter from './EmployeeFilter';
import PaginationControlled from '../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListEmployees() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [employeeFilter, setEmployeerFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter)
    setEmployeerFilter(newFilter);
  };
  const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
  const [getEmployees, { 
          loading: loadingEmployees, 
          data: employeesData, 
          error: employeesError, 
          fetchMore:  fetchMoreEmployees 
        } ]= useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter, page: paginator.page, limit: paginator.limit }})

  React.useEffect(() =>{
    getEmployees()
  }, [employeeFilter, paginator])

  const [deleteEmployee, { loading : loadingDelete }] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: (datas) => {
      if(datas.deleteEmployee.deleted){
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success'
        })
      }else{
        setNotifyAlert({
          isOpen: true,
          message: `Non Supprimé ! ${datas.deleteEmployee.message}.`,
          type: 'error'
        })
      } 
    },
    update(cache, { data: { deleteEmployee } }) {
      console.log('Updating cache after deletion:', deleteEmployee);
    
      const deletedEmployeeId = deleteEmployee.id;
    
      cache.modify({
        fields: {
          employees(existingEmployees = { totalCount: 0, nodes: [] }, { readField }) {
    
            const updatedEmployees = existingEmployees.nodes.filter((employee) =>
              readField('id', employee) !== deletedEmployeeId
            );
    
            console.log('Updated employees:', updatedEmployees);
    
            return {
              totalCount: existingEmployees.totalCount - 1,
              nodes: updatedEmployees,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err)
      setNotifyAlert({
        isOpen: true,
        message: 'Non Supprimé ! Veuillez réessayer.',
        type: 'error'
      })
    },
  })
  
  const onDeleteEmployee = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: "Voulez vous vraiment supprimer ?",
      onConfirm: () => { setConfirmDialog({isOpen: false})
                    deleteEmployee({ variables: { id : id }})
                  }
    })
  }

  const [updateEmployeeState, { loading : loadingPutState }] = useMutation(PUT_EMPLOYEE_STATE, {
    onCompleted: (datas) => {
      if(datas.updateEmployeeState.done){
        setNotifyAlert({
          isOpen: true,
          message: 'Changée avec succès',
          type: 'success'
        })
      }else{
        setNotifyAlert({
          isOpen: true,
          message: `Non changée ! ${datas.updateEmployeeState.message}.`,
          type: 'error'
        })
      } 
    },
    refetchQueries :[{query : GET_EMPLOYEES}],
    onError: (err) => {
      console.log(err)
      setNotifyAlert({
        isOpen: true,
        message: 'Non changée ! Veuillez réessayer.',
        type: 'error'
      })
    },
  })
  
  const onUpdateEmployeeState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: "Voulez vous vraiment changer ?",
      onConfirm: () => { setConfirmDialog({isOpen: false})
                        updateEmployeeState({ variables: { id : id }})
                  }
    })
  }

  return (
    <Grid container spacing={2} >
        <Grid item="true" xs={12}>
            <Box sx={{display : 'flex', justifyContent : 'flex-end', my : 3}}>
              <Link to="/online/employes/ajouter" className="no_style">
                <Button variant="contained" endIcon={<Add />} >
                    Ajouter un employé
                </Button>
              </Link>
            </Box>
        </Grid>
        <Grid item="true" xs={12}>
          <EmployeeFilter onFilterChange={handleFilterChange} />
        </Grid>
        <Grid item="true" xs={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {loadingEmployees && <Grid key={'pgrs'}  item xs={2} sm={4} md={3}><ProgressService type="mediaCard" /></Grid>}
              {employeesData?.employees?.nodes?.length < 1 && !loadingEmployees && <Alert severity="warning">Aucun employé trouvé.</Alert>}
              {employeesData?.employees?.nodes?.map((employee, index) => (
                <Grid xs={2} sm={4} md={3} key={index}>
                  <Item>
                    <EmployeeItemCard 
                                      employee={employee} 
                                      onDeleteEmployee={onDeleteEmployee} 
                                      onUpdateEmployeeState={onUpdateEmployeeState}
                    />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item="true" xs={12}>
          <PaginationControlled
            totalItems={employeesData?.employees?.totalCount}  // Nombre total d'éléments
            itemsPerPage={paginator.limit} // Nombre d'éléments par page
            currentPage={1}
            onChange={(page) => setPaginator({ ...paginator, page })}
          />
        </Grid>
    </Grid>
  );
}
