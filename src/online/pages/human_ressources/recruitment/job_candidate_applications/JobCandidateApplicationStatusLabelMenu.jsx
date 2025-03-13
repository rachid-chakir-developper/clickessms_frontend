import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Cancel, CheckCircle, Done, Euro, EventAvailable, HourglassTop, Star } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_JOB_CANDIDATE_APPLICATION_FIELDS } from '../../../../../_shared/graphql/mutations/JobCandidateApplicationMutations';
import { useSession } from '../../../../../_shared/context/SessionProvider';


export default function JobCandidateApplicationStatusLabelMenu({jobCandidateApplication}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageHumanRessources = authorizationSystem.requestAuthorization({
    type: 'manageHumanRessources',
  }).authorized;

  const canChangeStatus = ()=>{
    const workerIds = jobCandidateApplication?.workers?.map(w => w?.employee?.id)
    if(!workerIds?.includes(user?.employee?.id)) return false
    return jobCandidateApplication?.status === 'PAID' || jobCandidateApplication?.status === 'UNPAID'
  }
  const ALL_JOB_CANDIDATE_APPLICATIONE_STATUS = [
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default' },
    { value: 'INTERESTED', label: 'Intéressant', icon: <Star />, color: 'primary' },  // Nouveau statut
    { value: 'INTERVIEW', label: 'Entretien prévu', icon: <EventAvailable />, color: 'info' },  // Nouveau statut
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'warning' },
    { value: 'ACCEPTED', label: 'Accepté', icon: <CheckCircle />, color: 'success' },  // Nouveau statut
  ];
  
  const JOB_CANDIDATE_APPLICATIONE_STATUS = [
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default' },
    { value: 'INTERESTED', label: 'Intéressant', icon: <Star />, color: 'primary' },  // Nouveau statut
    { value: 'INTERVIEW', label: 'Entretien prévu', icon: <EventAvailable />, color: 'info' },  // Nouveau statut
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'warning' },
    { value: 'ACCEPTED', label: 'Accepté', icon: <CheckCircle />, color: 'success' },  // Nouveau statut
  ];
    const [updateJobCandidateApplicationFields, { loading: loadingPut }] = useMutation(PUT_JOB_CANDIDATE_APPLICATION_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
        // if(data.updateJobCandidateApplicationFields.success) setOpenDialog(true);
      },
      update(cache, { data: { updateJobCandidateApplicationFields } }) {
        const updatedJobCandidateApplication = updateJobCandidateApplicationFields.jobCandidateApplication;
  
        cache.modify({
          fields: {
            jobCandidateApplications(
              existingJobCandidateApplications = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedJobCandidateApplications = existingJobCandidateApplications.nodes.map((jobCandidateApplication) =>
                readField('id', jobCandidateApplication) === updatedJobCandidateApplication.id
                  ? updatedJobCandidateApplication
                  : jobCandidateApplication,
              );
  
              return {
                totalCount: existingJobCandidateApplications.totalCount,
                nodes: updatedJobCandidateApplications,
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
            options={canManageHumanRessources ? ALL_JOB_CANDIDATE_APPLICATIONE_STATUS : JOB_CANDIDATE_APPLICATIONE_STATUS}
            status={jobCandidateApplication?.status}
            type="jobCandidateApplication"
            loading={loadingPut}
            onChange={(status)=> {updateJobCandidateApplicationFields({ variables: {id: jobCandidateApplication?.id, jobCandidateApplicationData: {status}} })}}
            disabled={!canManageHumanRessources && !canChangeStatus()}
        />
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