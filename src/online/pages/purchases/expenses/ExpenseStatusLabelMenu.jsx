import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, Tooltip } from '@mui/material';
import { Cancel, Done, Euro, HourglassEmpty, HourglassFull, HourglassTop, Pending, Print, ReceiptLong, TaskAlt } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_EXPENSE_FIELDS } from '../../../../_shared/graphql/mutations/ExpenseMutations';
import { useSession } from '../../../../_shared/context/SessionProvider';
import InputSendComment from './expenses-tabs/expense-chat/InputSendComment';
import { EXPENSE_STATUS_CHOICES } from '../../../../_shared/tools/constants';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import GeneratePurchaseOrderButton from './GeneratePurchaseOrderButton';


export default function ExpenseStatusLabelMenu({expense}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;

  const canChangeStatus = ()=>{
    const workerIds = expense?.workers?.map(w => w?.employee?.id)
    if(!workerIds?.includes(user?.employee?.id)) return false
    return expense?.status === 'PAID' || expense?.status === 'UNPAID'
  }
  const ALL_EXPENSE_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default'},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success',},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning'},
    { value: "PAID", label: "Payé", icon: <Euro />, color: 'info'},
    { value: "UNPAID", label: "Non payé", icon: <Cancel />, color: 'success'},
  ];
  
  const EXPENSE_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default', hidden: true},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default', hidden: true},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success', hidden: true},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning', hidden: true},
    { value: "PAID", label: "Payé", icon: <Euro />, color: 'info', hidden: !canChangeStatus()},
    { value: "UNPAID", label: "Non payé", icon: <Cancel />, color: 'warning', hidden: !canChangeStatus()},
  ];
    const [updateExpenseFields, { loading: loadingPut }] = useMutation(PUT_EXPENSE_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
        if(data.updateExpenseFields.success) setOpenDialog(true);
      },
      update(cache, { data: { updateExpenseFields } }) {
        const updatedExpense = updateExpenseFields.expense;
  
        cache.modify({
          fields: {
            expenses(
              existingExpenses = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedExpenses = existingExpenses.nodes.map((expense) =>
                readField('id', expense) === updatedExpense.id
                  ? updatedExpense
                  : expense,
              );
  
              return {
                totalCount: existingExpenses.totalCount,
                nodes: updatedExpenses,
              };
            },
          },
        });
      },
    });
  

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <CustomizedStatusLabelMenu
            options={canManageFinance ? ALL_EXPENSE_STATUS : EXPENSE_STATUS}
            status={expense?.status}
            type="expense"
            loading={loadingPut}
            onChange={(status)=> {updateExpenseFields({ variables: {id: expense?.id, expenseData: {status}} })}}
            disabled={!canManageFinance && !canChangeStatus()}
        />
        {expense?.status===EXPENSE_STATUS_CHOICES.APPROVED && <GeneratePurchaseOrderButton expense={expense} />}
      </Box>

        {/* Modal pour demander le commentaire */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth={true} maxWidth="md">
          <DialogTitle>Ajouter un commentaire</DialogTitle>
          <DialogContent>
            <InputSendComment type="iconButton" expense={expense} onCommentSent={handleCloseDialog}/>
          </DialogContent>
          <DialogActions>
              <Button color="inherit" onClick={handleCloseDialog}>Annuler</Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}