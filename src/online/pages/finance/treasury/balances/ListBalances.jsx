import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_BALANCE } from '../../../../../_shared/graphql/mutations/BalanceMutations';
import { GET_BALANCES } from '../../../../../_shared/graphql/queries/BalanceQueries';
import BalanceFilter from './BalanceFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListBalances from './TableListBalances';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListBalances() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [balanceFilter, setBalanceFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBalanceFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBalances,
    {
      loading: loadingBalances,
      data: balancesData,
      error: balancesError,
      fetchMore: fetchMoreBalances,
    },
  ] = useLazyQuery(GET_BALANCES, {
    variables: {
      balanceFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getBalances();
  }, [balanceFilter, paginator]);

  const [deleteBalance, { loading: loadingDelete }] = useMutation(
    DELETE_BALANCE,
    {
      onCompleted: (datas) => {
        if (datas.deleteBalance.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteBalance.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteBalance } }) {
        console.log('Updating cache after deletion:', deleteBalance);

        const deletedBalanceId = deleteBalance.id;

        cache.modify({
          fields: {
            balances(
              existingBalances = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBalances = existingBalances.nodes.filter(
                (balance) =>
                  readField('id', balance) !== deletedBalanceId,
              );

              console.log('Updated balances:', updatedBalances);

              return {
                totalCount: existingBalances.totalCount - 1,
                nodes: updatedBalances,
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

  const onDeleteBalance = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBalance({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/finance/tresorerie/soldes/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un solde
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <BalanceFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item="true" xs={12}>
        <TableListBalances
          loading={loadingBalances}
          rows={balancesData?.balances?.nodes || []}
          onDeleteBalance={onDeleteBalance}
        />
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={balancesData?.balances?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
