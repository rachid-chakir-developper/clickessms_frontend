import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import EmployeeGroupItemCard from './EmployeeGroupItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_EMPLOYEE_GROUP,
  PUT_EMPLOYEE_GROUP_STATE,
} from '../../../../../_shared/graphql/mutations/EmployeeGroupMutations';
import { GET_EMPLOYEE_GROUPS } from '../../../../../_shared/graphql/queries/EmployeeGroupQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import EmployeeGroupFilter from './EmployeeGroupFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListEmployeeGroups() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [employeeGroupFilter, setEmployeeGroupFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setEmployeeGroupFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getEmployeeGroups,
    {
      loading: loadingEmployeeGroups,
      data: employeeGroupsData,
      error: employeeGroupsError,
      fetchMore: fetchMoreEmployeeGroups,
    },
  ] = useLazyQuery(GET_EMPLOYEE_GROUPS, {
    variables: {
      employeeGroupFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getEmployeeGroups();
  }, [employeeGroupFilter, paginator]);

  const [deleteEmployeeGroup, { loading: loadingDelete }] = useMutation(
    DELETE_EMPLOYEE_GROUP,
    {
      onCompleted: (datas) => {
        if (datas.deleteEmployeeGroup.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteEmployeeGroup.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteEmployeeGroup } }) {
        console.log('Updating cache after deletion:', deleteEmployeeGroup);

        const deletedEmployeeGroupId = deleteEmployeeGroup.id;

        cache.modify({
          fields: {
            employeeGroups(
              existingEmployeeGroups = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEmployeeGroups = existingEmployeeGroups.nodes.filter(
                (employeeGroup) =>
                  readField('id', employeeGroup) !== deletedEmployeeGroupId,
              );

              console.log('Updated employeeGroups:', updatedEmployeeGroups);

              return {
                totalCount: existingEmployeeGroups.totalCount - 1,
                nodes: updatedEmployeeGroups,
              };
            },
          },
        });
      },
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const onDeleteEmployeeGroup = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteEmployeeGroup({ variables: { id: id } });
      },
    });
  };

  const [updateEmployeeGroupState, { loading: loadingPutState }] = useMutation(
    PUT_EMPLOYEE_GROUP_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateEmployeeGroupState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateEmployeeGroupState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_EMPLOYEE_GROUPS }],
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non changée ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const onUpdateEmployeeGroupState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEmployeeGroupState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/ressources-humaines/employes/groupes/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un groupe d'employés
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <EmployeeGroupFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingEmployeeGroups && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {employeeGroupsData?.employeeGroups?.nodes?.length < 1 &&
              !loadingEmployeeGroups && (
                <Alert severity="warning">
                  Aucun groupe d'employés trouvé.
                </Alert>
              )}
            {employeeGroupsData?.employeeGroups?.nodes?.map(
              (employeeGroup, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Item>
                    <EmployeeGroupItemCard
                      employeeGroup={employeeGroup}
                      onDeleteEmployeeGroup={onDeleteEmployeeGroup}
                      onUpdateEmployeeGroupState={onUpdateEmployeeGroupState}
                    />
                  </Item>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={employeeGroupsData?.employeeGroups?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
