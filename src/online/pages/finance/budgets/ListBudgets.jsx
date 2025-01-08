import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import BudgetItemCard from './BudgetItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_BUDGET,
  PUT_BUDGET_STATE,
} from '../../../../_shared/graphql/mutations/BudgetMutations';
import { GET_BUDGETS } from '../../../../_shared/graphql/queries/BudgetQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import BudgetFilter from './BudgetFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListBudgets from './TableListBudgets';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListBudgets() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [budgetFilter, setBudgetFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBudgetFilter(newFilter);
    setPaginator({ ...paginator, page: 1 });
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBudgets,
    {
      loading: loadingBudgets,
      data: budgetsData,
      error: budgetsError,
      fetchMore: fetchMoreBudgets,
    },
  ] = useLazyQuery(GET_BUDGETS, {
    variables: { budgetFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getBudgets();
  }, [paginator]);
  
  const [deleteBudget, { loading: loadingDelete }] = useMutation(
    DELETE_BUDGET,
    {
      onCompleted: (datas) => {
        if (datas.deleteBudget.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteBudget.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteBudget } }) {
        console.log('Updating cache after deletion:', deleteBudget);

        const deletedBudgetId = deleteBudget.id;

        cache.modify({
          fields: {
            budgets(
              existingBudgets = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBudgets = existingBudgets.nodes.filter(
                (budget) => readField('id', budget) !== deletedBudgetId,
              );

              console.log('Updated budgets:', updatedBudgets);

              return {
                totalCount: existingBudgets.totalCount - 1,
                nodes: updatedBudgets,
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

  const onDeleteBudget = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBudget({ variables: { id: id } });
      },
    });
  };
  const [updateBudgetState, { loading: loadingPutState }] = useMutation(
    PUT_BUDGET_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateBudgetState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateBudgetState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_BUDGETS }],
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

  const onUpdateBudgetState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBudgetState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/finance/budgets/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un budget
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <BudgetFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingBudgets && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {budgetsData?.budgets?.nodes?.length < 1 && !loadingBudgets && (
              <Alert severity="warning">Aucun budget trouvé.</Alert>
            )}
            {budgetsData?.budgets?.nodes?.map((budget, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item>
                  <BudgetItemCard
                    budget={budget}
                    onDeleteBudget={onDeleteBudget}
                    onUpdateBudgetState={onUpdateBudgetState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <TableListBudgets
          loading={loadingBudgets}
          rows={budgetsData?.budgets?.nodes || []}
          onDeleteBudget={onDeleteBudget}
          onFilterChange={(newFilter) => handleFilterChange({ ...budgetFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={budgetsData?.budgets?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
