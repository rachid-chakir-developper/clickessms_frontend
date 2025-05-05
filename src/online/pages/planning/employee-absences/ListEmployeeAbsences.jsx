import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import EmployeeAbsenceItemCard from './EmployeeAbsenceItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { DELETE_EMPLOYEE_ABSENCE } from '../../../../_shared/graphql/mutations/EmployeeAbsenceMutations';
import { GET_EMPLOYEE_ABSENCES } from '../../../../_shared/graphql/queries/EmployeeAbsenceQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import EmployeeAbsenceFilter from './EmployeeAbsenceFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListEmployeeAbsences from './TableListEmployeeAbsences';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListEmployeeAbsences() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [employeeAbsenceFilter, setEmployeeAbsenceFilter] =
    React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setEmployeeAbsenceFilter(newFilter);
    setPaginator({ ...paginator, page: 1 });
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getEmployeeAbsences,
    {
      loading: loadingEmployeeAbsences,
      data: employeeAbsencesData,
      error: employeeAbsencesError,
      fetchMore: fetchMoreEmployeeAbsences,
    },
  ] = useLazyQuery(GET_EMPLOYEE_ABSENCES, {
    variables: {
      employeeAbsenceFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getEmployeeAbsences();
  }, [paginator]);

  const [deleteEmployeeAbsence, { loading: loadingDelete }] = useMutation(
    DELETE_EMPLOYEE_ABSENCE,
    {
      onCompleted: (datas) => {
        if (datas.deleteEmployeeAbsence.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteEmployeeAbsence.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteEmployeeAbsence } }) {
        console.log('Updating cache after deletion:', deleteEmployeeAbsence);

        const deletedEmployeeAbsenceId = deleteEmployeeAbsence.id;

        cache.modify({
          fields: {
            employeeAbsences(
              existingEmployeeAbsences = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEmployeeAbsences =
                existingEmployeeAbsences.nodes.filter(
                  (employeeAbsence) =>
                    readField('id', employeeAbsence) !==
                    deletedEmployeeAbsenceId,
                );

              console.log(
                'Updated employeeAbsences:',
                updatedEmployeeAbsences,
              );

              return {
                totalCount: existingEmployeeAbsences.totalCount - 1,
                nodes: updatedEmployeeAbsences,
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

  const onDeleteEmployeeAbsence = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteEmployeeAbsence({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/planning/absences-employes/ajouter?type=LEAVE"
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Add />}
            sx={{ mx: 3 }}>
              Demander un congé
            </Button>
          </Link>
          <Link
            to="/online/planning/absences-employes/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Déclarer une absence
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <EmployeeAbsenceFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListEmployeeAbsences
          loading={loadingEmployeeAbsences}
          rows={employeeAbsencesData?.employeeAbsences?.nodes || []}
          onDeleteEmployeeAbsence={onDeleteEmployeeAbsence}
          onFilterChange={(newFilter) => handleFilterChange({ ...employeeAbsenceFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={employeeAbsencesData?.employeeAbsences?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
