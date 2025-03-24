import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Cancel, CheckCircle, Done, Euro, EventAvailable, HourglassTop, Send, Star } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_JOB_CANDIDATE_INFORMATION_SHEET_FIELDS } from '../../../../../_shared/graphql/mutations/JobCandidateInformationSheetMutations';
import { useSession } from '../../../../../_shared/context/SessionProvider';
import { JOB_CANDIDATE_INFORMATION_SHEET_STATUS } from '../../../../../_shared/tools/constants';
import GenerateEmployeeButton from './GenerateEmployeeButton';


export default function JobCandidateInformationSheetStatusLabelMenu({jobCandidateInformationSheet}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageHumanRessources = authorizationSystem.requestAuthorization({
    type: 'manageHumanRessources',
  }).authorized;

  const canChangeStatus = ()=>{
    const workerIds = jobCandidateInformationSheet?.workers?.map(w => w?.employee?.id)
    if(!workerIds?.includes(user?.employee?.id)) return false
    return jobCandidateInformationSheet?.status === 'PAID' || jobCandidateInformationSheet?.status === 'UNPAID'
  }
  const ALL_JOB_CANDIDATE_INFORMATION_SHEETE_STATUS = [
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default' },
    { value: 'SENT', label: 'Envoyé', icon: <Send />, color: 'info' },
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'warning' },
    { value: 'ACCEPTED', label: 'Accepté', icon: <CheckCircle />, color: 'success' },  // Nouveau statut
  ];
  
  const JOB_CANDIDATE_INFORMATION_SHEETE_STATUS = [
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default' },
    { value: 'SENT', label: 'Envoyé', icon: <Send />, color: 'info' },
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'warning' },
    { value: 'ACCEPTED', label: 'Accepté', icon: <CheckCircle />, color: 'success' },  // Nouveau statut
  ];
    const [updateJobCandidateInformationSheetFields, { loading: loadingPut }] = useMutation(PUT_JOB_CANDIDATE_INFORMATION_SHEET_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
        // if(data.updateJobCandidateInformationSheetFields.success) setOpenDialog(true);
      },
      update(cache, { data: { updateJobCandidateInformationSheetFields } }) {
        const updatedJobCandidateInformationSheet = updateJobCandidateInformationSheetFields.jobCandidateInformationSheet;
  
        cache.modify({
          fields: {
            jobCandidateInformationSheets(
              existingJobCandidateInformationSheets = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedJobCandidateInformationSheets = existingJobCandidateInformationSheets.nodes.map((jobCandidateInformationSheet) =>
                readField('id', jobCandidateInformationSheet) === updatedJobCandidateInformationSheet.id
                  ? updatedJobCandidateInformationSheet
                  : jobCandidateInformationSheet,
              );
  
              return {
                totalCount: existingJobCandidateInformationSheets.totalCount,
                nodes: updatedJobCandidateInformationSheets,
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
            options={canManageHumanRessources ? ALL_JOB_CANDIDATE_INFORMATION_SHEETE_STATUS : JOB_CANDIDATE_INFORMATION_SHEETE_STATUS}
            status={jobCandidateInformationSheet?.status}
            type="jobCandidateInformationSheet"
            loading={loadingPut}
            onChange={(status)=> {updateJobCandidateInformationSheetFields({ variables: {id: jobCandidateInformationSheet?.id, jobCandidateInformationSheetData: {status}} })}}
            disabled={!canManageHumanRessources && !canChangeStatus()}
        />
        {jobCandidateInformationSheet?.status===JOB_CANDIDATE_INFORMATION_SHEET_STATUS.ACCEPTED && <GenerateEmployeeButton buttonType="buttonIcon" jobCandidateInformationSheet={jobCandidateInformationSheet} />}
      </Box>

        {/* Modal pour demander le commentaire */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth={true} maxWidth="md">
          <DialogTitle>Ajouter un commentaire</DialogTitle>
          <DialogContent>
            
          </DialogContent>
          <DialogActions>
              <Button color="inherit" onClick={handleCloseDialog}>Annuler</Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}