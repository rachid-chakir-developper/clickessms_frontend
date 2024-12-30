import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { Block, Cancel, Done, Drafts, Euro, HourglassEmpty, HourglassFull, HourglassTop, Pending, Print, ReceiptLong, Send, TaskAlt } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_BENEFICIARY_ADMISSION_FIELDS } from '../../../../_shared/graphql/mutations/BeneficiaryAdmissionMutations';
import { useSession } from '../../../../_shared/context/SessionProvider';
import InputSendComment from './beneficiary_admissions-tabs/beneficiary_admission-chat/InputSendComment';
import { BENEFICIARY_ADMISSION_STATUS_CHOICES } from '../../../../_shared/tools/constants';
import { Link } from 'react-router-dom';
import GenerateBeneficiaryButton from './GenerateBeneficiaryButton';


export default function BeneficiaryAdmissionStatusLabelMenu({beneficiaryAdmission , openChangeReason, setOpenChangeReason}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageActivity = authorizationSystem.requestAuthorization({
    type: 'manageActivity',
  }).authorized;

  const canChangeStatus = () => {
    const workerIds = beneficiaryAdmission?.workers?.map(w => w?.employee?.id);
    if (!workerIds?.includes(user?.employee?.id)) return false;
    return (
      beneficiaryAdmission?.status === 'APPROVED' || 
      beneficiaryAdmission?.status === 'REJECTED' || 
      beneficiaryAdmission?.status === 'CANCELED'
    );
  };
  
  const ALL_BENEFICIARY_ADMISSION_STATUS = [
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default' },
    { value: 'APPROVED', label: 'Approuvé', icon: <Done />, color: 'success' },
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'warning' },
    { value: 'CANCELED', label: 'Annulé', icon: <Block />, color: 'error' },
  ];
  
  const BENEFICIARY_ADMISSION_STATUS = [
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default', hidden: true },
    { value: 'APPROVED', label: 'Approuvé', icon: <Done />, color: 'success', hidden: true },
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'warning', hidden: true },
    { value: 'CANCELED', label: 'Annulé', icon: <Block />, color: 'error', hidden: !canChangeStatus() },
  ];
  
    const [updateBeneficiaryAdmissionFields, { loading: loadingPut }] = useMutation(PUT_BENEFICIARY_ADMISSION_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
        if(data.updateBeneficiaryAdmissionFields.success){
          if(!openDialog) setOpenDialog(true);
          else handleCloseDialog()
        }
      },
      update(cache, { data: { updateBeneficiaryAdmissionFields } }) {
        const updatedBeneficiaryAdmission = updateBeneficiaryAdmissionFields.beneficiaryAdmission;
  
        cache.modify({
          fields: {
            beneficiaryAdmissions(
              existingBeneficiaryAdmissions = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaryAdmissions = existingBeneficiaryAdmissions.nodes.map((beneficiaryAdmission) =>
                readField('id', beneficiaryAdmission) === updatedBeneficiaryAdmission.id
                  ? updatedBeneficiaryAdmission
                  : beneficiaryAdmission,
              );
  
              return {
                totalCount: existingBeneficiaryAdmissions.totalCount,
                nodes: updatedBeneficiaryAdmissions,
              };
            },
          },
        });
      },
    });
  

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenChangeReason(false)
  };

  React.useEffect(()=>{
    if(openChangeReason && !openDialog && canManageActivity) setOpenDialog(true);
  }, [openChangeReason])

  return (
    <Box>
      <Box display="flex" alignItems="center">
          { beneficiaryAdmission?.status !== BENEFICIARY_ADMISSION_STATUS_CHOICES.DRAFT ? <CustomizedStatusLabelMenu
              options={canManageActivity ? ALL_BENEFICIARY_ADMISSION_STATUS : BENEFICIARY_ADMISSION_STATUS}
              status={beneficiaryAdmission?.status}
              type="beneficiaryAdmission"
              loading={loadingPut}
              onChange={(status)=> {updateBeneficiaryAdmissionFields({ variables: {id: beneficiaryAdmission?.id, beneficiaryAdmissionData: {status}} })}}
              disabled={!canManageActivity && !canChangeStatus()}
          />:
          <Tooltip title="Cliquez pour compléter">
            <Link
              to={`/online/ressources-humaines/admissions-beneficiaires/modifier/${beneficiaryAdmission?.id}`}
              className="no_style"
            >
              <Box display="flex" alignItems="center">
                <Drafts color="warning" /> {/* Icône ajoutée avec couleur warning */}
                <Typography variant="body2" sx={{ color: 'warning.main', ml: 1 }}>
                  Brouillon
                </Typography>
              </Box>
            </Link>
          </Tooltip>
        }
        {beneficiaryAdmission?.status===BENEFICIARY_ADMISSION_STATUS_CHOICES.APPROVED && <GenerateBeneficiaryButton beneficiaryAdmission={beneficiaryAdmission} />}
      </Box>

        {/* Modal pour demander le motif */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth={true} maxWidth="md">
          <DialogTitle>Ajouter un motif</DialogTitle>
          <DialogContent>
            <InputSendStatusReason type="iconButton" beneficiaryAdmission={beneficiaryAdmission} updateBeneficiaryAdmissionFields={updateBeneficiaryAdmissionFields}/>
          </DialogContent>
          <DialogActions>
              <Button color="inherit" onClick={handleCloseDialog}>Annuler</Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}


function InputSendStatusReason({type, beneficiaryAdmission, updateBeneficiaryAdmissionFields}){
  const [newStatusReason, setNewStatusReason] = React.useState(beneficiaryAdmission?.statusReason || '');
  const handleSendStatusReason = () => {
      if (newStatusReason.trim() === '') return;
      updateBeneficiaryAdmissionFields({ variables: {id: beneficiaryAdmission?.id, beneficiaryAdmissionData: {statusReason: newStatusReason}} })
      setNewStatusReason('');
  };

  return (
          <Box style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
              <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  label="Tapez votre motif..."
                  value={newStatusReason}
                  onChange={(e) => setNewStatusReason(e.target.value)}
              />
              {
                  type !== 'iconButton' ? <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSendStatusReason}
                      endIcon={<SendIcon />}
                      style={{ marginLeft: 8 }}
                  >
                  Valider
                  </Button> :
                  <Tooltip title="Envoyer">
                      <IconButton
                          color="primary"
                          onClick={handleSendStatusReason}
                          style={{ marginLeft: 8 }}
                      >
                      <Send />
                  </IconButton>
              </Tooltip>
              }
          </Box>
  );
};