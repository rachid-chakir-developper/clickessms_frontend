import { gql } from '@apollo/client';
import {
  COMMENT_BASIC_INFOS,
  COMMENT_DETAILS,
} from '../fragments/CommentFragment';

export const GET_COMMENT = gql`
  query GetComment($id: ID!) {
    comment(id: $id) {
      ...CommentDetailsFragment
    }
  }
  ${COMMENT_DETAILS}
`;

export const GET_COMMENTS = gql`
  query GetComments($taskStepId: ID, $offset: Int, $limit: Int, $page: Int) {
    comments(
      taskStepId: $taskStepId
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CommentBasicInfosFragment
      }
    }
  }
  ${COMMENT_BASIC_INFOS}
`;

export const GET_TASK_STEP_COMMENTS = gql`
  query GetTaskStepComments(
    $taskStepId: ID
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    taskStepComments(
      taskStepId: $taskStepId
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CommentBasicInfosFragment
      }
    }
  }
  ${COMMENT_BASIC_INFOS}
`;

export const GET_TICKET_COMMENTS = gql`
  query GetTicketComments(
    $ticketId: ID
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    ticketComments(
      ticketId: $ticketId
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CommentBasicInfosFragment
      }
    }
  }
  ${COMMENT_BASIC_INFOS}
`;

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments(
    $taskId: ID
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    taskComments(
      taskId: $taskId
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CommentBasicInfosFragment
      }
    }
  }
  ${COMMENT_BASIC_INFOS}
`;

export const GET_TASK_ACTION_COMMENTS = gql`
  query GetTaskActionComments(
    $taskActionId: ID
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    taskActionComments(
      taskActionId: $taskActionId
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CommentBasicInfosFragment
      }
    }
  }
  ${COMMENT_BASIC_INFOS}
`;

export const GET_EXPENSE_COMMENTS = gql`
  query GetExpenseComments(
    $expenseId: ID
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    expenseComments(
      expenseId: $expenseId
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CommentBasicInfosFragment
      }
    }
  }
  ${COMMENT_BASIC_INFOS}
`;

// Add more comment-related queries here
