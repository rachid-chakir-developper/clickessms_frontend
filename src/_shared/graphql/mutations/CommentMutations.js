import { gql } from '@apollo/client';
import { COMMENT_BASIC_INFOS } from '../fragments/CommentFragment';

export const POST_COMMENT = gql`
  mutation CreateComment($taskStepId : ID, $commentData: CommentInput!, $image : Upload) {
    createComment(taskStepId : $taskStepId, commentData: $commentData, image : $image) {
      comment{
        ...CommentBasicInfosFragment
      }
    }
  }
  ${COMMENT_BASIC_INFOS}
`;

export const PUT_COMMENT = gql`
  mutation UpdateComment($id: ID!, $commentData: CommentInput!, $image : Upload) {
    updateComment(id: $id, commentData: $commentData, image : $image) {
      comment{
        ...CommentBasicInfosFragment
      }
    }
  }
  ${COMMENT_BASIC_INFOS}
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id){
      id
      success
      deleted
      message
    }
  }
`;