import * as React from 'react';
import { Box } from '@mui/material';
import { Cancel, Done, Euro, HourglassTop } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_BENEFICIARY_EXPENSE_FIELDS } from '../../../../_shared/graphql/mutations/BeneficiaryExpenseMutations';
import { useSession } from '../../../../_shared/context/SessionProvider';


export default function BeneficiaryExpenseStatusLabelMenu({beneficiaryExpense}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;

  const canChangeStatus = ()=>{
    const workerIds = beneficiaryExpense?.workers?.map(w => w?.employee?.id)
    if(!workerIds?.includes(user?.employee?.id)) return false
    return beneficiaryExpense?.status === 'PAID' || beneficiaryExpense?.status === 'UNPAID'
  }
  const ALL_BENEFICIARY_EXPENSE_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default'},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success',},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning'},
    { value: "PAID", label: "Payé", icon: <Euro />, color: 'info'},
    { value: "UNPAID", label: "Non payé", icon: <Cancel />, color: 'success'},
  ];
  
  const BENEFICIARY_EXPENSE_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default', hidden: true},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default', hidden: true},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success', hidden: true},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning', hidden: true},
    { value: "PAID", label: "Payé", icon: <Euro />, color: 'info', hidden: !canChangeStatus()},
    { value: "UNPAID", label: "Non payé", icon: <Cancel />, color: 'warning', hidden: !canChangeStatus()},
  ];
    const [updateBeneficiaryExpenseFields, { loading: loadingPut }] = useMutation(PUT_BENEFICIARY_EXPENSE_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
      },
      update(cache, { data: { updateBeneficiaryExpenseFields } }) {
        const updatedBeneficiaryExpense = updateBeneficiaryExpenseFields.beneficiaryExpense;
  
        cache.modify({
          fields: {
            beneficiaryExpenses(
              existingBeneficiaryExpenses = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaryExpenses = existingBeneficiaryExpenses.nodes.map((beneficiaryExpense) =>
                readField('id', beneficiaryExpense) === updatedBeneficiaryExpense.id
                  ? updatedBeneficiaryExpense
                  : beneficiaryExpense,
              );
  
              return {
                totalCount: existingBeneficiaryExpenses.totalCount,
                nodes: updatedBeneficiaryExpenses,
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
            options={canManageFinance ? ALL_BENEFICIARY_EXPENSE_STATUS : BENEFICIARY_EXPENSE_STATUS}
            status={beneficiaryExpense?.status}
            type="beneficiaryExpense"
            loading={loadingPut}
            onChange={(status)=> {updateBeneficiaryExpenseFields({ variables: {id: beneficiaryExpense?.id, beneficiaryExpenseData: {status}} })}}
            disabled={!canManageFinance && !canChangeStatus() || true}
        />
      </Box>
    </Box>
  );
}