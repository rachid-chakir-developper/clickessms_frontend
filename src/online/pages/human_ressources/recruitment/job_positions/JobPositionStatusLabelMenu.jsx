import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Cancel, CheckCircle, Done, Euro, EventAvailable, HourglassTop, Send, Star } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_JOB_POSITION_FIELDS } from '../../../../../_shared/graphql/mutations/JobPositionMutations';
import { useSession } from '../../../../../_shared/context/SessionProvider';
// import { JOB_POSITION_STATUS } from '../../../../../_shared/tools/constants';


export default function JobPositionStatusLabelMenu({jobPosition}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageHumanRessources = authorizationSystem.requestAuthorization({
    type: 'manageHumanRessources',
  }).authorized;

  const canChangeStatus = ()=>{
    const workerIds = jobPosition?.workers?.map(w => w?.employee?.id)
    if(!workerIds?.includes(user?.employee?.id)) return false
    return jobPosition?.status === 'PAID' || jobPosition?.status === 'UNPAID'
  }
  const ALL_JOB_POSITION_STATUS = [
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default' },
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'warning' },
    { value: 'ACCEPTED', label: 'Accepté', icon: <CheckCircle />, color: 'success' },  // Nouveau statut
  ];
  
  const JOB_POSITION_STATUS = [
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default' },
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'warning' },
    { value: 'ACCEPTED', label: 'Accepté', icon: <CheckCircle />, color: 'success' },  // Nouveau statut
  ];
    const [updateJobPositionFields, { loading: loadingPut }] = useMutation(PUT_JOB_POSITION_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
        // if(data.updateJobPositionFields.success) setOpenDialog(true);
      },
      update(cache, { data: { updateJobPositionFields } }) {
        const updatedJobPosition = updateJobPositionFields.jobPosition;
  
        cache.modify({
          fields: {
            jobPositions(
              existingJobPositions = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedJobPositions = existingJobPositions.nodes.map((jobPosition) =>
                readField('id', jobPosition) === updatedJobPosition.id
                  ? updatedJobPosition
                  : jobPosition,
              );
  
              return {
                totalCount: existingJobPositions.totalCount,
                nodes: updatedJobPositions,
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
            options={canManageHumanRessources ? ALL_JOB_POSITION_STATUS : JOB_POSITION_STATUS}
            status={jobPosition?.status}
            type="jobPosition"
            loading={loadingPut}
            onChange={(status)=> {updateJobPositionFields({ variables: {id: jobPosition?.id, jobPositionData: {status}} })}}
            disabled={!canManageHumanRessources && !canChangeStatus()}
        />
        {/* {jobPosition?.status===JOB_POSITION_STATUS.ACCEPTED && <GenerateEmployeeButton buttonType="buttonIcon" jobPosition={jobPosition} />} */}
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