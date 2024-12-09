import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_PURCHASE_ORDER,
  PUT_PURCHASE_ORDER_STATE,
} from '../../../../_shared/graphql/mutations/PurchaseOrderMutations';
import { GET_PURCHASE_ORDERS } from '../../../../_shared/graphql/queries/PurchaseOrderQueries';
import PurchaseOrderFilter from './PurchaseOrderFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListPurchaseOrders from './TableListPurchaseOrders';

export default function ListPurchaseOrders() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [purchaseOrderFilter, setPurchaseOrderFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setPurchaseOrderFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getPurchaseOrders,
    {
      loading: loadingPurchaseOrders,
      data: purchaseOrdersData,
      error: purchaseOrdersError,
      fetchMore: fetchMorePurchaseOrders,
    },
  ] = useLazyQuery(GET_PURCHASE_ORDERS, {
    variables: { purchaseOrderFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getPurchaseOrders();
  }, [purchaseOrderFilter, paginator]);

  const [deletePurchaseOrder, { loading: loadingDelete }] = useMutation(DELETE_PURCHASE_ORDER, {
    onCompleted: (datas) => {
      if (datas.deletePurchaseOrder.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deletePurchaseOrder.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deletePurchaseOrder } }) {
      console.log('Updating cache after deletion:', deletePurchaseOrder);

      const deletedPurchaseOrderId = deletePurchaseOrder.id;

      cache.modify({
        fields: {
          purchaseOrders(existingPurchaseOrders = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedPurchaseOrders = existingPurchaseOrders.nodes.filter(
              (purchaseOrder) => readField('id', purchaseOrder) !== deletedPurchaseOrderId,
            );

            console.log('Updated purchaseOrders:', updatedPurchaseOrders);

            return {
              totalCount: existingPurchaseOrders.totalCount - 1,
              nodes: updatedPurchaseOrders,
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

  const onDeletePurchaseOrder = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deletePurchaseOrder({ variables: { id: id } });
      },
    });
  };

  const [updatePurchaseOrderState, { loading: loadingPutState }] = useMutation(
    PUT_PURCHASE_ORDER_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updatePurchaseOrderState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updatePurchaseOrderState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_PURCHASE_ORDERS }],
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

  const onUpdatePurchaseOrderState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updatePurchaseOrderState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PurchaseOrderFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListPurchaseOrders
          loading={loadingPurchaseOrders}
          rows={purchaseOrdersData?.purchaseOrders?.nodes || []}
          onDeletePurchaseOrder={onDeletePurchaseOrder}
          onFilterChange={(newFilter) => handleFilterChange({ ...purchaseOrderFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={purchaseOrdersData?.purchaseOrders?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
