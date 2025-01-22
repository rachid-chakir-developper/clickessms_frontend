import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_BENEFICIARY_EXPENSE } from '../../../../../_shared/graphql/mutations/BeneficiaryExpenseMutations';
import { GET_BENEFICIARY_EXPENSES } from '../../../../../_shared/graphql/queries/BeneficiaryExpenseQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListBeneficiaryExpenses from '../../../activities/beneficiary_expenses/TableListBeneficiaryExpenses';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BeneficiaryExpenses({beneficiary}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [beneficiaryExpenseFilter, setBeneficiaryExpenseFilter] =
    React.useState({beneficiaries: [beneficiary?.id]});
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
    variables: {
      beneficiaryExpenseFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getBeneficiaryExpenses();
  }, [beneficiaryExpenseFilter, paginator]);

  const [deleteBeneficiaryExpense, { loading: loadingDelete }] = useMutation(
    DELETE_BENEFICIARY_EXPENSE,
    {
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
            message: `Non Supprimé ! ${datas.deleteBeneficiaryExpense.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteBeneficiaryExpense } }) {
        console.log('Updating cache after deletion:', deleteBeneficiaryExpense);

        const deletedBeneficiaryExpenseId = deleteBeneficiaryExpense.id;

        cache.modify({
          fields: {
            beneficiaryExpenses(
              existingBeneficiaryExpenses = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaryExpenses =
                existingBeneficiaryExpenses.nodes.filter(
                  (beneficiaryExpense) =>
                    readField('id', beneficiaryExpense) !==
                    deletedBeneficiaryExpenseId,
                );

              console.log(
                'Updated beneficiaryExpenses:',
                updatedBeneficiaryExpenses,
              );

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
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableListBeneficiaryExpenses
          loading={loadingBeneficiaryExpenses}
          rows={beneficiaryExpensesData?.beneficiaryExpenses?.nodes || []}
          onDeleteBeneficiaryExpense={onDeleteBeneficiaryExpense}
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
