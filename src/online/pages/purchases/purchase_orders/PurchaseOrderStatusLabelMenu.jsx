import * as React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Cancel, Done, Euro, HourglassTop, ReceiptLong } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_PURCHASE_ORDER_FIELDS } from '../../../../_shared/graphql/mutations/PurchaseOrderMutations';
import { useSession } from '../../../../_shared/context/SessionProvider';
import { PURCHASE_ORDER_STATUS_CHOICES } from '../../../../_shared/tools/constants';


export default function PurchaseOrderStatusLabelMenu({purchaseOrder}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;

  const canChangeStatus = ()=>{
    const workerIds = purchaseOrder?.workers?.map(w => w?.employee?.id)
    if(!workerIds?.includes(user?.employee?.id)) return false
    return purchaseOrder?.status === 'PAID' || purchaseOrder?.status === 'UNPAID'
  }
  const ALL_PURCHASE_ORDER_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default'},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success',},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning'},
  ];
  
  const PURCHASE_ORDER_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default', hidden: true},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default', hidden: true},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success', hidden: true},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning', hidden: true},
  ];
    const [updatePurchaseOrderFields, { loading: loadingPut }] = useMutation(PUT_PURCHASE_ORDER_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
      },
      update(cache, { data: { updatePurchaseOrderFields } }) {
        const updatedPurchaseOrder = updatePurchaseOrderFields.purchaseOrder;
  
        cache.modify({
          fields: {
            purchaseOrders(
              existingPurchaseOrders = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedPurchaseOrders = existingPurchaseOrders.nodes.map((purchaseOrder) =>
                readField('id', purchaseOrder) === updatedPurchaseOrder.id
                  ? updatedPurchaseOrder
                  : purchaseOrder,
              );
  
              return {
                totalCount: existingPurchaseOrders.totalCount,
                nodes: updatedPurchaseOrders,
              };
            },
          },
        });
      },
    });


  return (
    <Box>
      <Box display="flex" alignItems="center">
        <CustomizedStatusLabelMenu
            options={canManageFinance ? ALL_PURCHASE_ORDER_STATUS : PURCHASE_ORDER_STATUS}
            status={purchaseOrder?.status}
            type="purchaseOrder"
            loading={loadingPut}
            onChange={(status)=> {updatePurchaseOrderFields({ variables: {id: purchaseOrder?.id, purchaseOrderData: {status}} })}}
            disabled={!canManageFinance && !canChangeStatus()}
        />
      </Box>
    </Box>
  );
}