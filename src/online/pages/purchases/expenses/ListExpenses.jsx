import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import ExpenseItemCard from './ExpenseItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_EXPENSE,
  PUT_EXPENSE_STATE,
} from '../../../../_shared/graphql/mutations/ExpenseMutations';
import { GET_EXPENSES } from '../../../../_shared/graphql/queries/ExpenseQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import ExpenseFilter from './ExpenseFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListExpenses from './TableListExpenses';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListExpenses() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [expenseFilter, setExpenseFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setExpenseFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getExpenses,
    {
      loading: loadingExpenses,
      data: expensesData,
      error: expensesError,
      fetchMore: fetchMoreExpenses,
    },
  ] = useLazyQuery(GET_EXPENSES, {
    variables: { expenseFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getExpenses();
  }, [expenseFilter, paginator]);

  const [deleteExpense, { loading: loadingDelete }] = useMutation(DELETE_EXPENSE, {
    onCompleted: (datas) => {
      if (datas.deleteExpense.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteExpense.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteExpense } }) {
      console.log('Updating cache after deletion:', deleteExpense);

      const deletedExpenseId = deleteExpense.id;

      cache.modify({
        fields: {
          expenses(existingExpenses = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedExpenses = existingExpenses.nodes.filter(
              (expense) => readField('id', expense) !== deletedExpenseId,
            );

            console.log('Updated expenses:', updatedExpenses);

            return {
              totalCount: existingExpenses.totalCount - 1,
              nodes: updatedExpenses,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

  const onDeleteExpense = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteExpense({ variables: { id: id } });
      },
    });
  };

  const [updateExpenseState, { loading: loadingPutState }] = useMutation(
    PUT_EXPENSE_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateExpenseState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateExpenseState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_EXPENSES }],
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

  const onUpdateExpenseState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateExpenseState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          {!canManageFinance && <Link
            to="/online/achats/depenses-engagements/ajouter?type=REQUEST"
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Add />}
            sx={{ mx: 3 }}>
              Demander une dépense
            </Button>
          </Link>}
          {
          canManageFinance && <Link to="/online/achats/depenses-engagements/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une dépense
            </Button>
          </Link>}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ExpenseFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListExpenses
          loading={loadingExpenses}
          rows={expensesData?.expenses?.nodes || []}
          onDeleteExpense={onDeleteExpense}
          onFilterChange={(newFilter) => handleFilterChange({ ...expenseFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={expensesData?.expenses?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
