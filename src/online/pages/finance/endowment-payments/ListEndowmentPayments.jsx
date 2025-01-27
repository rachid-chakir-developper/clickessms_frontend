import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_ENDOWMENT_PAYMENT,
  PUT_ENDOWMENT_PAYMENT_STATE,
} from '../../../../_shared/graphql/mutations/EndowmentPaymentMutations';
import { GET_ENDOWMENT_PAYMENTS } from '../../../../_shared/graphql/queries/EndowmentPaymentQueries';
import EndowmentPaymentFilter from './EndowmentPaymentFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListEndowmentPayments from './TableListEndowmentPayments';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add, Settings } from '@mui/icons-material';

export default function ListEndowmentPayments() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [endowmentPaymentFilter, setEndowmentPaymentFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setEndowmentPaymentFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getEndowmentPayments,
    {
      loading: loadingEndowmentPayments,
      data: endowmentPaymentsData,
      error: endowmentPaymentsError,
      fetchMore: fetchMoreEndowmentPayments,
    },
  ] = useLazyQuery(GET_ENDOWMENT_PAYMENTS, {
    variables: { endowmentPaymentFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getEndowmentPayments();
  }, [endowmentPaymentFilter, paginator]);

  const [deleteEndowmentPayment, { loading: loadingDelete }] = useMutation(DELETE_ENDOWMENT_PAYMENT, {
    onCompleted: (datas) => {
      if (datas.deleteEndowmentPayment.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteEndowmentPayment.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteEndowmentPayment } }) {
      console.log('Updating cache after deletion:', deleteEndowmentPayment);

      const deletedEndowmentPaymentId = deleteEndowmentPayment.id;

      cache.modify({
        fields: {
          endowmentPayments(existingEndowmentPayments = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedEndowmentPayments = existingEndowmentPayments.nodes.filter(
              (endowmentPayment) => readField('id', endowmentPayment) !== deletedEndowmentPaymentId,
            );

            console.log('Updated endowmentPayments:', updatedEndowmentPayments);

            return {
              totalCount: existingEndowmentPayments.totalCount - 1,
              nodes: updatedEndowmentPayments,
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

  const onDeleteEndowmentPayment = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteEndowmentPayment({ variables: { id: id } });
      },
    });
  };

  const [updateEndowmentPaymentState, { loading: loadingPutState }] = useMutation(
    PUT_ENDOWMENT_PAYMENT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateEndowmentPaymentState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateEndowmentPaymentState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_ENDOWMENT_PAYMENTS }],
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

  const onUpdateEndowmentPaymentState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEndowmentPaymentState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          {canManageFinance && <Link
            to="/online/finance/dotations/liste"
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Settings />}
            sx={{ mx: 3 }}>
              Les dotations
            </Button>
          </Link>}
          <Link to="/online/finance/dotations-paiements/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un paiement
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <EndowmentPaymentFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListEndowmentPayments
          loading={loadingEndowmentPayments}
          rows={endowmentPaymentsData?.endowmentPayments?.nodes || []}
          onDeleteEndowmentPayment={onDeleteEndowmentPayment}
          onFilterChange={(newFilter) => handleFilterChange({ ...endowmentPaymentFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={endowmentPaymentsData?.endowmentPayments?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
