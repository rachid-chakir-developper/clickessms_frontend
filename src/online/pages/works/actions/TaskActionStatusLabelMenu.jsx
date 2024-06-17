import * as React from 'react';
import { Box } from '@mui/material';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useMutation } from '@apollo/client';
import { PUT_TASK_ACTION } from '../../../../_shared/graphql/mutations/TaskActionMutations';
import { GET_TICKETS } from '../../../../_shared/graphql/queries/TicketQueries';
import { GET_UNDESIRABLE_EVENTS } from '../../../../_shared/graphql/queries/UndesirableEventQueries';

export default function TaskActionStatusLabelMenu({taskAction}) {
    const [updateTaskAction, { loading: loadingPut }] = useMutation(PUT_TASK_ACTION, {
      refetchQueries: [{ query: GET_UNDESIRABLE_EVENTS }, { query: GET_TICKETS }],
      update(cache, { data: { updateTaskAction } }) {
        const updatedTaskAction = updateTaskAction.taskAction;
  
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
    
  return (
    <Box>
        <CustomizedStatusLabelMenu 
            status={taskAction?.status}
            type="action"
            loading={loadingPut}
            onChange={(status)=> {updateTaskAction({ variables: {id: taskAction?.id, taskActionData: {status}} })}}
        />
    </Box>
  );
}