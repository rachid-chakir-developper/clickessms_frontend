import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_BENEFICIARY_EXPENSE,
  PUT_BENEFICIARY_EXPENSE_STATE,
} from '../../../../_shared/graphql/mutations/BeneficiaryExpenseMutations';
import { GET_BENEFICIARY_EXPENSES } from '../../../../_shared/graphql/queries/BeneficiaryExpenseQueries';
import BeneficiaryExpenseFilter from './BeneficiaryExpenseFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListBeneficiaryExpenses from './TableListBeneficiaryExpenses';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListBeneficiaryExpenses() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [beneficiaryExpenseFilter, setBeneficiaryExpenseFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBeneficiaryExpenseFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBeneficiaryExpenses,
    {
      loading: loadingBeneficiaryExpenses,
      data: beneficiaryExpensesData,
      error: beneficiaryExpensesError,
      fetchMore: fetchMoreBeneficiaryExpenses,
    },
  ] = useLazyQuery(GET_BENEFICIARY_EXPENSES, {
    variables: { beneficiaryExpenseFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getBeneficiaryExpenses();
  }, [beneficiaryExpenseFilter, paginator]);

  const [deleteBeneficiaryExpense, { loading: loadingDelete }] = useMutation(DELETE_BENEFICIARY_EXPENSE, {
    onCompleted: (datas) => {
      if (datas.deleteBeneficiaryExpense.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteBeneficiaryExpense.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteBeneficiaryExpense } }) {
      console.log('Updating cache after deletion:', deleteBeneficiaryExpense);

      const deletedBeneficiaryExpenseId = deleteBeneficiaryExpense.id;

      cache.modify({
        fields: {
          beneficiaryExpenses(existingBeneficiaryExpenses = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedBeneficiaryExpenses = existingBeneficiaryExpenses.nodes.filter(
              (beneficiaryExpense) => readField('id', beneficiaryExpense) !== deletedBeneficiaryExpenseId,
            );

            console.log('Updated beneficiaryExpenses:', updatedBeneficiaryExpenses);

            return {
              totalCount: existingBeneficiaryExpenses.totalCount - 1,
              nodes: updatedBeneficiaryExpenses,
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

  const onDeleteBeneficiaryExpense = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBeneficiaryExpense({ variables: { id: id } });
      },
    });
  };

  const [updateBeneficiaryExpenseState, { loading: loadingPutState }] = useMutation(
    PUT_BENEFICIARY_EXPENSE_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateBeneficiaryExpenseState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateBeneficiaryExpenseState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_BENEFICIARY_EXPENSES }],
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

  const onUpdateBeneficiaryExpenseState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiaryExpenseState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/activites/depenses/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une dépense
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <BeneficiaryExpenseFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListBeneficiaryExpenses
          loading={loadingBeneficiaryExpenses}
          rows={beneficiaryExpensesData?.beneficiaryExpenses?.nodes || []}
          onDeleteBeneficiaryExpense={onDeleteBeneficiaryExpense}
          onFilterChange={(newFilter) => handleFilterChange({ ...beneficiaryExpenseFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={beneficiaryExpensesData?.beneficiaryExpenses?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
