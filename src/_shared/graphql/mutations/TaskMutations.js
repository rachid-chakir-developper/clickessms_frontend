import { gql } from '@apollo/client';
import { TASK_BASIC_INFOS } from '../fragments/TaskFragment';

export const POST_TASK = gql`
  mutation CreateTask($taskData: TaskInput!) {
    createTask(taskData: $taskData,) {
      task {
        ...TaskBasicInfosFragment
      }
    }
  }
  ${TASK_BASIC_INFOS}
`;

export const PUT_TASK = gql`
  mutation UpdateTask($id: ID!, $taskData: TaskInput!) {
    updateTask(id: $id, taskData: $taskData,) {
      task {
        ...TaskBasicInfosFragment
      }
    }
  }
  ${TASK_BASIC_INFOS}
`;

export const PUT_TASK_STATE = gql`
  mutation UpdateTaskState($id: ID!) {
    updateTaskState(id: $id) {
      done
      success
      message
      task {
        ...TaskBasicInfosFragment
      }
    }
  }
  ${TASK_BASIC_INFOS}
`;
export const PUT_TASK_FIELDS = gql`
  mutation UpdateTaskFields($id: ID!, $taskData: TaskInput!) {
    updateTaskFields(id: $id, taskData: $taskData) {
      done
      success
      message
      task {
        ...TaskBasicInfosFragment
      }
    }
  }
  ${TASK_BASIC_INFOS}
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
