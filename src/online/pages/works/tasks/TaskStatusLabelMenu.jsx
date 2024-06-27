import * as React from 'react';
import { Box } from '@mui/material';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useMutation } from '@apollo/client';
import { PUT_TASK_FIELDS } from '../../../../_shared/graphql/mutations/TaskMutations';



export default function TaskStatusLabelMenu({task}) {
    const [updateTaskFields, { loading: loadingPut }] = useMutation(PUT_TASK_FIELDS, {
      update(cache, { data: { updateTaskFields } }) {
        const updatedTask = updateTaskFields.task;
  
        cache.modify({
          fields: {
            tasks(
              existingTasks = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedTasks = existingTasks.nodes.map((task) =>
                readField('id', task) === updatedTask.id
                  ? updatedTask
                  : task,
              );
  
              return {
                totalCount: existingTasks.totalCount,
                nodes: updatedTasks,
              };
            },
          },
        });
      },
    });
  return (
    <Box>
        <CustomizedStatusLabelMenu 
            status={task?.status}
            type="task"
            loading={loadingPut}
            onChange={(status)=> {updateTaskFields({ variables: {id: task?.id, taskData: {status}} })}}
        />
    </Box>
  );
}