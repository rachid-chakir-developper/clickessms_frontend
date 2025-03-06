import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_CASH_REGISTER } from '../../../../../_shared/graphql/mutations/CashRegisterMutations';
import { GET_CASH_REGISTERS } from '../../../../../_shared/graphql/queries/CashRegisterQueries';
import CashRegisterFilter from './CashRegisterFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListCashRegisters from './TableListCashRegisters';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListCashRegisters() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [cashRegisterFilter, setCashRegisterFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setCashRegisterFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getCashRegisters,
    {
      loading: loadingCashRegisters,
      data: cashRegistersData,
      error: cashRegistersError,
      fetchMore: fetchMoreCashRegisters,
    },
  ] = useLazyQuery(GET_CASH_REGISTERS, {
    variables: {
      cashRegisterFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getCashRegisters();
  }, [cashRegisterFilter, paginator]);

  const [deleteCashRegister, { loading: loadingDelete }] = useMutation(
    DELETE_CASH_REGISTER,
    {
      onCompleted: (datas) => {
        if (datas.deleteCashRegister.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteCashRegister.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteCashRegister } }) {
        console.log('Updating cache after deletion:', deleteCashRegister);

        const deletedCashRegisterId = deleteCashRegister.id;

        cache.modify({
          fields: {
            cashRegisters(
              existingCashRegisters = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedCashRegisters = existingCashRegisters.nodes.filter(
                (cashRegister) => readField('id', cashRegister) !== deletedCashRegisterId,
              );

              console.log('Updated cashRegisters:', updatedCashRegisters);

              return {
                totalCount: existingCashRegisters.totalCount - 1,
                nodes: updatedCashRegisters,
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

  const onDeleteCashRegister = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteCashRegister({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/finance/tresorerie/caisses/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une caisse
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <CashRegisterFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListCashRegisters
          loading={loadingCashRegisters}
          rows={cashRegistersData?.cashRegisters?.nodes || []}
          onDeleteCashRegister={onDeleteCashRegister}
          onFilterChange={(newFilter) => handleFilterChange({ ...cashRegisterFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={cashRegistersData?.cashRegisters?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
