import { gql } from '@apollo/client';
import {
  TASK_ACTION_BASIC_INFOS,
  TASK_ACTION_DETAILS,
  TASK_ACTION_RECAP_DETAILS,
} from '../fragments/TaskActionFragment';

export const GET_TASK_ACTION = gql`
  query GetTaskAction($id: ID!) {
    taskAction(id: $id) {
      ...TaskActionDetailsFragment
    }
  }
  ${TASK_ACTION_DETAILS}
`;

export const GET_TASK_ACTIONS = gql`
  query GetTaskActions(
    $taskActionFilter: TaskActionFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    taskActions(
      taskActionFilter: $taskActionFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...TaskActionBasicInfosFragment
      }
    }
  }
  ${TASK_ACTION_BASIC_INFOS}
`;

export const TASK_ACTION_RECAP = gql`
  query GetTaskAction($id: ID!) {
    taskAction(id: $id) {
      ...TaskActionRecapDetailsFragment
    }
  }
  ${TASK_ACTION_RECAP_DETAILS}
`;
// Add more taskAction-related queries here
