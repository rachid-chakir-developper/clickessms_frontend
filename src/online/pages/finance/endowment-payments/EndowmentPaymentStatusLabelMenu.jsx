import * as React from 'react';
import { Box } from '@mui/material';
import { Cancel, Done, Euro, HourglassTop } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_ENDOWMENT_PAYMENT_FIELDS } from '../../../../_shared/graphql/mutations/EndowmentPaymentMutations';
import { useSession } from '../../../../_shared/context/SessionProvider';


export default function EndowmentPaymentStatusLabelMenu({endowmentPayment}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;

  const canChangeStatus = ()=>{
    const workerIds = endowmentPayment?.workers?.map(w => w?.employee?.id)
    if(!workerIds?.includes(user?.employee?.id)) return false
    return endowmentPayment?.status === 'PAID' || endowmentPayment?.status === 'UNPAID'
  }
  const ALL_ENDOWMENT_PAYMENT_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default'},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success',},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning'},
    { value: "PAID", label: "Payé", icon: <Euro />, color: 'info'},
    { value: "UNPAID", label: "Non payé", icon: <Cancel />, color: 'success'},
  ];
  
  const ENDOWMENT_PAYMENT_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default', hidden: true},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default', hidden: true},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success', hidden: true},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning', hidden: true},
    { value: "PAID", label: "Payé", icon: <Euro />, color: 'info', hidden: !canChangeStatus()},
    { value: "UNPAID", label: "Non payé", icon: <Cancel />, color: 'warning', hidden: !canChangeStatus()},
  ];
    const [updateEndowmentPaymentFields, { loading: loadingPut }] = useMutation(PUT_ENDOWMENT_PAYMENT_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
      },
      update(cache, { data: { updateEndowmentPaymentFields } }) {
        const updatedEndowmentPayment = updateEndowmentPaymentFields.endowmentPayment;
  
        cache.modify({
          fields: {
            endowmentPayments(
              existingEndowmentPayments = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEndowmentPayments = existingEndowmentPayments.nodes.map((endowmentPayment) =>
                readField('id', endowmentPayment) === updatedEndowmentPayment.id
                  ? updatedEndowmentPayment
                  : endowmentPayment,
              );
  
              return {
                totalCount: existingEndowmentPayments.totalCount,
                nodes: updatedEndowmentPayments,
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
            options={canManageFinance ? ALL_ENDOWMENT_PAYMENT_STATUS : ENDOWMENT_PAYMENT_STATUS}
            status={endowmentPayment?.status}
            type="endowmentPayment"
            loading={loadingPut}
            onChange={(status)=> {updateEndowmentPaymentFields({ variables: {id: endowmentPayment?.id, endowmentPaymentData: {status}} })}}
            disabled={!canManageFinance && !canChangeStatus() || true}
        />
      </Box>
    </Box>
  );
}