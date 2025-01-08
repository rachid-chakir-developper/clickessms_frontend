import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import ExpenseReportItemCard from './ExpenseReportItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_EXPENSE_REPORT,
  PUT_EXPENSE_REPORT_STATE,
} from '../../../../_shared/graphql/mutations/ExpenseReportMutations';
import { GET_EXPENSE_REPORTS } from '../../../../_shared/graphql/queries/ExpenseReportQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import ExpenseReportFilter from './ExpenseReportFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListExpenseReports from './TableListExpenseReports';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListExpenseReports() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [expenseReportFilter, setExpenseReportFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setExpenseReportFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getExpenseReports,
    {
      loading: loadingExpenseReports,
      data: expenseReportsData,
      error: expenseReportsError,
      fetchMore: fetchMoreExpenseReports,
    },
  ] = useLazyQuery(GET_EXPENSE_REPORTS, {
    variables: { expenseReportFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getExpenseReports();
  }, [expenseReportFilter, paginator]);

  const [deleteExpenseReport, { loading: loadingDelete }] = useMutation(DELETE_EXPENSE_REPORT, {
    onCompleted: (datas) => {
      if (datas.deleteExpenseReport.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteExpenseReport.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteExpenseReport } }) {
      console.log('Updating cache after deletion:', deleteExpenseReport);

      const deletedExpenseReportId = deleteExpenseReport.id;

      cache.modify({
        fields: {
          expenseReports(existingExpenseReports = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedExpenseReports = existingExpenseReports.nodes.filter(
              (expenseReport) => readField('id', expenseReport) !== deletedExpenseReportId,
            );

            console.log('Updated expenseReports:', updatedExpenseReports);

            return {
              totalCount: existingExpenseReports.totalCount - 1,
              nodes: updatedExpenseReports,
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

  const onDeleteExpenseReport = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteExpenseReport({ variables: { id: id } });
      },
    });
  };

  const [updateExpenseReportState, { loading: loadingPutState }] = useMutation(
    PUT_EXPENSE_REPORT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateExpenseReportState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateExpenseReportState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_EXPENSE_REPORTS }],
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

  const onUpdateExpenseReportState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateExpenseReportState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          {!canManageFinance && <Link
            to="/online/achats/notes-frais/ajouter?type=REQUEST"
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Add />}
            sx={{ mx: 3 }}>
              Demander une note de frais
            </Button>
          </Link>}
          {
          canManageFinance && <Link to="/online/achats/notes-frais/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une note de frais
            </Button>
          </Link>}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ExpenseReportFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListExpenseReports
          loading={loadingExpenseReports}
          rows={expenseReportsData?.expenseReports?.nodes || []}
          onDeleteExpenseReport={onDeleteExpenseReport}
          onFilterChange={(newFilter) => handleFilterChange({ ...expenseReportFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={expenseReportsData?.expenseReports?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
