import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_CR_TRANSACTION } from '../../../../../../_shared/graphql/mutations/CashRegisterTransactionMutations';
import { GET_CR_TRANSACTIONS } from '../../../../../../_shared/graphql/queries/CashRegisterTransactionQueries';
import CashRegisterTransactionFilter from './CashRegisterTransactionFilter';
import PaginationControlled from '../../../../../../_shared/components/helpers/PaginationControlled';
import TableListCashRegisterTransactions from './TableListCashRegisterTransactions';
import DialogCashRegisterTransaction from './DialogAddCashRegisterTransaction';
import DialogAddCashRegisterTransaction from './DialogAddCashRegisterTransaction';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListCashRegisterTransactions({cashRegister}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [cashRegisterTransactionFilter, setCashRegisterTransactionFilter] = React.useState({cashRegisters: [cashRegister?.id]});
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setCashRegisterTransactionFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getCashRegisterTransactions,
    {
      loading: loadingCashRegisterTransactions,
      data: cashRegisterTransactionsData,
      error: cashRegisterTransactionsError,
      fetchMore: fetchMoreCashRegisterTransactions,
    },
  ] = useLazyQuery(GET_CR_TRANSACTIONS, {
    variables: {
      cashRegisterTransactionFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getCashRegisterTransactions();
  }, [cashRegisterTransactionFilter, paginator]);

  const [deleteCashRegisterTransaction, { loading: loadingDelete }] = useMutation(
    DELETE_CR_TRANSACTION,
    {
      onCompleted: (datas) => {
        if (datas.deleteCashRegisterTransaction.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteCashRegisterTransaction.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteCashRegisterTransaction } }) {
        console.log('Updating cache after deletion:', deleteCashRegisterTransaction);

        const deletedCashRegisterTransactionId = deleteCashRegisterTransaction.id;

        cache.modify({
          fields: {
            cashRegisterTransactions(
              existingCashRegisterTransactions = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedCashRegisterTransactions = existingCashRegisterTransactions.nodes.filter(
                (cashRegisterTransaction) => readField('id', cashRegisterTransaction) !== deletedCashRegisterTransactionId,
              );

              console.log('Updated cashRegisterTransactions:', updatedCashRegisterTransactions);

              return {
                totalCount: existingCashRegisterTransactions.totalCount - 1,
                nodes: updatedCashRegisterTransactions,
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

  const onDeleteCashRegisterTransaction = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteCashRegisterTransaction({ variables: { id: id } });
      },
    });
  };

  const [isCashRegisterTransactionDialogOpen, setCashRegisterTransactionDialogOpen] = React.useState(false);
  const [cashRegisterTransaction, setCashRegisterTransaction] = React.useState(null);

  const handleCashRegisterTransactionConfirm = (cashRegisterTransactionData) => {
    // Ajouter ici la logique pour enregistrer les données du paiement
    console.log('CashRegisterTransaction data:', cashRegisterTransactionData);
    // Exemple : onUpdateCreditNoteFields({ variables: { id: creditNote?.id, creditNoteData: { status: 'PAID' }, cashRegisterTransactionData } });
    setCashRegisterTransactionDialogOpen(false); // Fermer le dialogue après la confirmation
  };

  const handleCashRegisterTransactionEdit = (cashRegisterTransaction) => {
    setCashRegisterTransaction(cashRegisterTransaction)
    setCashRegisterTransactionDialogOpen(true);
  };

  return (<>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Button variant="contained" endIcon={<Add />} onClick={()=>{setCashRegisterTransaction(null), setCashRegisterTransactionDialogOpen(true)}}>
            Ajouter un mouvement
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <CashRegisterTransactionFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListCashRegisterTransactions
          loading={loadingCashRegisterTransactions}
          rows={cashRegisterTransactionsData?.cashRegisterTransactions?.nodes || []}
          onDeleteCashRegisterTransaction={onDeleteCashRegisterTransaction}
          onEditCashRegisterTransaction={handleCashRegisterTransactionEdit}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={cashRegisterTransactionsData?.cashRegisterTransactions?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
      <DialogAddCashRegisterTransaction
        open={isCashRegisterTransactionDialogOpen}
        onClose={() => setCashRegisterTransactionDialogOpen(false)}
        onConfirm={handleCashRegisterTransactionConfirm}
        cashRegister={cashRegister}
        cashRegisterTransaction={cashRegisterTransaction}
      />
      </>
  );
}
