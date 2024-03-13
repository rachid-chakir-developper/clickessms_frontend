import { gql } from '@apollo/client';
import { TASK_BASIC_INFOS } from '../fragments/TaskFragment';

export const POST_TASK = gql`
  mutation CreateTask($taskData: TaskInput!, $image : Upload) {
    createTask(taskData: $taskData, image : $image) {
      task{
        ...TaskBasicInfosFragment
      }
    }
  }
  ${TASK_BASIC_INFOS}
`;

export const PUT_TASK = gql`
  mutation UpdateTask($id: ID!, $taskData: TaskInput!, $image : Upload) {
    updateTask(id: $id, taskData: $taskData, image : $image) {
      task{
        ...TaskBasicInfosFragment
      }
    }
  }
  ${TASK_BASIC_INFOS}
`;


export const PUT_TASK_STATE = gql`
  mutation UpdateTaskState($id: ID!) {
    updateTaskState(id: $id){
      done
      success
      message
      task{
        ...TaskBasicInfosFragment
      }
    }
  }
  ${TASK_BASIC_INFOS}
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id){
      id
      success
      deleted
      message
    }
  }
`;
