import { gql } from '@apollo/client';
import { TASK_ACTION_BASIC_INFOS } from '../fragments/TaskActionFragment';

export const POST_TASK_ACTION = gql`
  mutation CreateTaskAction(
    $taskActionData: TaskActionInput!
    $document: Upload
  ) {
    createTaskAction(taskActionData: $taskActionData, document: $document) {
      taskAction {
        ...TaskActionBasicInfosFragment
      }
    }
  }
  ${TASK_ACTION_BASIC_INFOS}
`;

export const PUT_TASK_ACTION = gql`
  mutation UpdateTaskAction(
    $id: ID!
    $taskActionData: TaskActionInput!
    $document: Upload
  ) {
    updateTaskAction(
      id: $id
      taskActionData: $taskActionData
      document: $document
    ) {
      taskAction {
        ...TaskActionBasicInfosFragment
      }
    }
  }
  ${TASK_ACTION_BASIC_INFOS}
`;

export const DELETE_TASK_ACTION = gql`
  mutation DeleteTaskAction($id: ID!) {
    deleteTaskAction(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
