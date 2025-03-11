import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Cancel, CheckCircle, Done, Euro, EventAvailable, HourglassTop, Star } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_JOB_CANDIDATE_FIELDS } from '../../../../../_shared/graphql/mutations/JobCandidateMutations';
import { useSession } from '../../../../../_shared/context/SessionProvider';


export default function JobCandidateStatusLabelMenu({jobCandidate}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageHumanRessources = authorizationSystem.requestAuthorization({
    type: 'manageHumanRessources',
  }).authorized;

  const canChangeStatus = ()=>{
    const workerIds = jobCandidate?.workers?.map(w => w?.employee?.id)
    if(!workerIds?.includes(user?.employee?.id)) return false
    return jobCandidate?.status === 'PAID' || jobCandidate?.status === 'UNPAID'
  }
  const ALL_JOB_CANDIDATEE_STATUS = [
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default' },
    { value: 'INTERESTED', label: 'Intéressant', icon: <Star />, color: 'primary' },  // Nouveau statut
    { value: 'INTERVIEW', label: 'Entretien prévu', icon: <EventAvailable />, color: 'info' },  // Nouveau statut
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'warning' },
    { value: 'ACCEPTED', label: 'Accepté', icon: <CheckCircle />, color: 'success' },  // Nouveau statut
  ];
  
  const JOB_CANDIDATEE_STATUS = [
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default' },
    { value: 'INTERESTED', label: 'Intéressant', icon: <Star />, color: 'primary' },  // Nouveau statut
    { value: 'INTERVIEW', label: 'Entretien prévu', icon: <EventAvailable />, color: 'info' },  // Nouveau statut
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'warning' },
    { value: 'ACCEPTED', label: 'Accepté', icon: <CheckCircle />, color: 'success' },  // Nouveau statut
  ];
    const [updateJobCandidateFields, { loading: loadingPut }] = useMutation(PUT_JOB_CANDIDATE_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
        if(data.updateJobCandidateFields.success) setOpenDialog(true);
      },
      update(cache, { data: { updateJobCandidateFields } }) {
        const updatedJobCandidate = updateJobCandidateFields.jobCandidate;
  
        cache.modify({
          fields: {
            jobCandidates(
              existingJobCandidates = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedJobCandidates = existingJobCandidates.nodes.map((jobCandidate) =>
                readField('id', jobCandidate) === updatedJobCandidate.id
                  ? updatedJobCandidate
                  : jobCandidate,
              );
  
              return {
                totalCount: existingJobCandidates.totalCount,
                nodes: updatedJobCandidates,
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
            options={canManageHumanRessources ? ALL_JOB_CANDIDATEE_STATUS : JOB_CANDIDATEE_STATUS}
            status={jobCandidate?.status}
            type="jobCandidate"
            loading={loadingPut}
            onChange={(status)=> {updateJobCandidateFields({ variables: {id: jobCandidate?.id, jobCandidateData: {status}} })}}
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