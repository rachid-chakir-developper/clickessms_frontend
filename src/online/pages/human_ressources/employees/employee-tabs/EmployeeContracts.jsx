import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_EMPLOYEE_CONTRACT } from '../../../../../_shared/graphql/mutations/EmployeeContractMutations';
import { GET_EMPLOYEE_CONTRACTS } from '../../../../../_shared/graphql/queries/EmployeeContractQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListEmployeeContracts from '../employee-contracts/TableListEmployeeContracts';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EmployeeContracts({employee}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [employeeContractFilter, setEmployeeContractFilter] =
    React.useState({employees: [employee?.id]});
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setEmployeeContractFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getEmployeeContracts,
    {
      loading: loadingEmployeeContracts,
      data: employeeContractsData,
      error: employeeContractsError,
      fetchMore: fetchMoreEmployeeContracts,
    },
  ] = useLazyQuery(GET_EMPLOYEE_CONTRACTS, {
    variables: {
      employeeContractFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getEmployeeContracts();
  }, [employeeContractFilter, paginator]);

  const [deleteEmployeeContract, { loading: loadingDelete }] = useMutation(
    DELETE_EMPLOYEE_CONTRACT,
    {
      onCompleted: (datas) => {
        if (datas.deleteEmployeeContract.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteEmployeeContract.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteEmployeeContract } }) {
        console.log('Updating cache after deletion:', deleteEmployeeContract);

        const deletedEmployeeContractId = deleteEmployeeContract.id;

        cache.modify({
          fields: {
            employeeContracts(
              existingEmployeeContracts = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEmployeeContracts =
                existingEmployeeContracts.nodes.filter(
                  (employeeContract) =>
                    readField('id', employeeContract) !==
                    deletedEmployeeContractId,
                );

              console.log(
                'Updated employeeContracts:',
                updatedEmployeeContracts,
              );

              return {
                totalCount: existingEmployeeContracts.totalCount - 1,
                nodes: updatedEmployeeContracts,
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

  const onDeleteEmployeeContract = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteEmployeeContract({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableListEmployeeContracts
          loading={loadingEmployeeContracts}
          rows={employeeContractsData?.employeeContracts?.nodes || []}
          onDeleteEmployeeContract={onDeleteEmployeeContract}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={employeeContractsData?.employeeContracts?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
