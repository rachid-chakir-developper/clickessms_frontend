import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useMutation } from '@apollo/client';
import { PUT_TASK_ACTION_FIELDS } from '../../../../_shared/graphql/mutations/TaskActionMutations';
import { GET_TICKETS } from '../../../../_shared/graphql/queries/TicketQueries';
import { GET_UNDESIRABLE_EVENTS } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import InputSendComment from './actions-tabs/action-chat/InputSendComment';

export default function TaskActionStatusLabelMenu({taskAction, disabled}) {
  const [updateTaskActionFields, { loading: loadingPut }] = useMutation(PUT_TASK_ACTION_FIELDS, {
    onCompleted: (data) => {
      console.log(data);
      if(data.updateTaskActionFields.taskAction) setOpenDialog(true);
    },
    refetchQueries: [{ query: GET_UNDESIRABLE_EVENTS }, { query: GET_TICKETS }],
    update(cache, { data: { updateTaskActionFields } }) {
      const updatedTaskAction = updateTaskActionFields.taskAction;

      cache.modify({
        fields: {
          taskActions(
            existingTaskActions = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedTaskActions = existingTaskActions.nodes.map((taskAction) =>
              readField('id', taskAction) === updatedTaskAction.id
                ? updatedTaskAction
                : taskAction,
            );

            return {
              totalCount: existingTaskActions.totalCount,
              nodes: updatedTaskActions,
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
        <CustomizedStatusLabelMenu 
            status={taskAction?.status}
            type="action"
            loading={loadingPut}
            onChange={(status)=> {updateTaskActionFields({ variables: {id: taskAction?.id, taskActionData: {status}} })}}
            disabled={disabled}
        />
        {/* Modal pour demander le commentaire */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth={true} maxWidth="md">
          <DialogTitle>Ajouter un commentaire</DialogTitle>
          <DialogContent>
            <InputSendComment type="iconButton" taskAction={taskAction} onCommentSent={handleCloseDialog}/>
          </DialogContent>
          <DialogActions>
              <Button color="inherit" onClick={handleCloseDialog}>Annuler</Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}