import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Icon, IconButton, Stack, styled, TextField, Tooltip, Typography } from '@mui/material';
import { Block, Cancel, Done, Drafts, Euro, HourglassEmpty, HourglassFull, HourglassTop, Pending, Print, ReceiptLong, Send, TaskAlt } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_BENEFICIARY_ADMISSION_FIELDS } from '../../../../_shared/graphql/mutations/BeneficiaryAdmissionMutations';
import { useSession } from '../../../../_shared/context/SessionProvider';
import { BENEFICIARY_ADMISSION_STATUS_CHOICES } from '../../../../_shared/tools/constants';
import { Link } from 'react-router-dom';
import GenerateBeneficiaryButton from './GenerateBeneficiaryButton';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
      <DialogStatusReason 
        beneficiaryAdmission={beneficiaryAdmission} 
        updateBeneficiaryAdmissionFields={updateBeneficiaryAdmissionFields}
        loading={loadingPut}
        onClose={handleCloseDialog}
        open={openDialog}
      />
    </Box>
  );
}


function DialogStatusReason({open, onClose, type, beneficiaryAdmission, updateBeneficiaryAdmissionFields, loading=false}){
  const validationSchema = yup.object({});
  const formik = useFormik({
      initialValues: {
        responseDate: beneficiaryAdmission ? (beneficiaryAdmission?.responseDate ? dayjs(beneficiaryAdmission?.responseDate) : null) : dayjs(new Date()) ,
        statusReason: beneficiaryAdmission?.statusReason || '',
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        let valuesCopy = {...values};
        updateBeneficiaryAdmissionFields({ 
          variables: {
            id: beneficiaryAdmission?.id,
            beneficiaryAdmissionData: valuesCopy
          } })
      },
    });
  const [newStatusReason, setNewStatusReason] = React.useState(beneficiaryAdmission?.statusReason || '');
  const handleSendStatusReason = () => {
      if (newStatusReason.trim() === '') return;
      updateBeneficiaryAdmissionFields({ variables: {id: beneficiaryAdmission?.id, beneficiaryAdmissionData: {statusReason: newStatusReason}} })
      setNewStatusReason('');
  };

  return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>Ajouter un motif de réponse</DialogTitle>
            <DialogContent>
              <Box style={{  marginTop: 20 }}>
                <Grid container>
                  <Grid item xs={12} sm={6} md={6}>
                    <Item>
                      <TheDesktopDatePicker
                        label="Date de réponse"
                        value={formik.values.responseDate}
                        onChange={(date) => formik.setFieldValue('responseDate', date)}
                        disabled={loading}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} >
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Motif de réponse"
                        multiline
                        rows={4}
                        value={formik.values.statusReason}
                        onChange={(e) => formik.setFieldValue('statusReason', e.target.value)}
                        disabled={loading}
                      />
                    </Item>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={onClose}>Annuler</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || loading}
                >
                  Valider
                </Button>
            </DialogActions>
          </form>
        </Dialog>
  );
};