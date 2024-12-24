import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, Tooltip } from '@mui/material';
import { Cancel, Done, Euro, HourglassEmpty, HourglassFull, HourglassTop, Pending, Print, ReceiptLong, TaskAlt } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_EXPENSE_REPORT_FIELDS } from '../../../../_shared/graphql/mutations/ExpenseReportMutations';
import { useSession } from '../../../../_shared/context/SessionProvider';
import InputSendComment from './expense_reports-tabs/expense_report-chat/InputSendComment';
import { EXPENSE_REPORT_STATUS_CHOICES } from '../../../../_shared/tools/constants';


export default function ExpenseReportStatusLabelMenu({expenseReport}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;

  const canChangeStatus = ()=>{
    const workerIds = expenseReport?.workers?.map(w => w?.employee?.id)
    if(!workerIds?.includes(user?.employee?.id)) return false
    return expenseReport?.status === 'PAID' || expenseReport?.status === 'UNPAID'
  }
  const ALL_EXPENSE_REPORT_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default'},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success',},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning'},
    { value: "REIMBURSED", label: "Remboursé", icon: <Euro />, color: 'info'},
  ];
  
  const EXPENSE_REPORT_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default', hidden: true},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default', hidden: true},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success', hidden: true},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning', hidden: true},
    { value: "REIMBURSED", label: "Remboursé", icon: <Euro />, color: 'info', hidden: !canChangeStatus()},
  ];
    const [updateExpenseReportFields, { loading: loadingPut }] = useMutation(PUT_EXPENSE_REPORT_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
        if(data.updateExpenseReportFields.success) setOpenDialog(true);
      },
      update(cache, { data: { updateExpenseReportFields } }) {
        const updatedExpenseReport = updateExpenseReportFields.expenseReport;
  
        cache.modify({
          fields: {
            expenseReports(
              existingExpenseReports = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedExpenseReports = existingExpenseReports.nodes.map((expenseReport) =>
                readField('id', expenseReport) === updatedExpenseReport.id
                  ? updatedExpenseReport
                  : expenseReport,
              );
  
              return {
                totalCount: existingExpenseReports.totalCount,
                nodes: updatedExpenseReports,
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
            options={canManageFinance ? ALL_EXPENSE_REPORT_STATUS : EXPENSE_REPORT_STATUS}
            status={expenseReport?.status}
            type="expenseReport"
            loading={loadingPut}
            onChange={(status)=> {updateExpenseReportFields({ variables: {id: expenseReport?.id, expenseReportData: {status}} })}}
            disabled={!canManageFinance && !canChangeStatus()}
        />
      </Box>

        {/* Modal pour demander le commentaire */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth={true} maxWidth="md">
          <DialogTitle>Ajouter un commentaire</DialogTitle>
          <DialogContent>
            <InputSendComment type="iconButton" expenseReport={expenseReport} onCommentSent={handleCloseDialog}/>
          </DialogContent>
          <DialogActions>
              <Button color="inherit" onClick={handleCloseDialog}>Annuler</Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}