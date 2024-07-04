import * as React from 'react';
import { Box } from '@mui/material';
import { Cancel, Done, HourglassEmpty, HourglassFull, HourglassTop, Pending, TaskAlt } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_TASK_FIELDS } from '../../../../_shared/graphql/mutations/TaskMutations';


export default function TaskStatusLabelMenu({task}) {
  
  const authorizationSystem = useAuthorizationSystem();
  const canManageFacility = authorizationSystem.requestAuthorization({
    type: 'manageFacility',
  }).authorized;

  const canChangeStatus = ()=>{
    return task?.status === 'APPROVED' || task?.status === 'TO_DO' || task?.status === 'IN_PROGRESS' || task?.status === 'COMPLETED'
  }
  const ALL_TASK_STATUS = [
    { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default'},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success',},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning'},
    { value: "TO_DO", label: "À faire", icon: <HourglassFull />, color: 'default'},
    { value: "IN_PROGRESS", label: "En cours", icon: <Pending />, color: 'info'},
    { value: "COMPLETED", label: "Terminée", icon: <TaskAlt />, color: 'success'},
  ];
  
  const TASK_STATUS = [
    { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default', hidden: true},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default', hidden: true},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success', hidden: true},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning', hidden: true},
    { value: "TO_DO", label: "À faire", icon: <HourglassFull />, color: 'default', hidden: !canChangeStatus()},
    { value: "IN_PROGRESS", label: "En cours", icon: <Pending />, color: 'info', hidden: !canChangeStatus()},
    { value: "COMPLETED", label: "Terminée", icon: <TaskAlt />, color: 'success', hidden: !canChangeStatus()},
  ];
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
            options={canManageFacility ? ALL_TASK_STATUS : TASK_STATUS}
            status={task?.status}
            type="task"
            loading={loadingPut}
            onChange={(status)=> {updateTaskFields({ variables: {id: task?.id, taskData: {status}} })}}
            disabled={!canChangeStatus}
        />
    </Box>
  );
}