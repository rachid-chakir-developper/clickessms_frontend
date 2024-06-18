
import { gql } from '@apollo/client';
import { COMMENT_BASIC_INFOS, COMMENT_DETAILS } from '../fragments/CommentFragment';

export const ON_COMMENT_ADDED = gql`
  subscription onCommentAdded($taskStepId: ID, $ticketId: ID){
    onCommentAdded(taskStepId: $taskStepId, ticketId: $ticketId){
      comment{
        ...CommentDetailsFragment
      }
    }
  }
  ${COMMENT_DETAILS}
`;

export const ON_COMMENT_UPDATED = gql`
  subscription onCommentUpdated($taskStepId: ID, $ticketId: ID) {
    onCommentUpdated(taskStepId: $taskStepId, ticketId: $ticketId) {
      comment{
        ...CommentBasicInfosFragment
      }
    }
  }
  ${COMMENT_BASIC_INFOS}
`;

export const ON_COMMENT_DELETED = gql`
  subscription onCommentDeleted($taskStepId: ID, $ticketId: ID){
    onCommentDeleted(taskStepId: $taskStepId, ticketId: $ticketId) {
      comment{
        ...CommentBasicInfosFragment
      }
    }
  }
  ${COMMENT_BASIC_INFOS}
`;

// Similar subscriptions can be defined for Client and Employee entities.