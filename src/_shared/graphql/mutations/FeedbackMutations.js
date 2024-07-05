import { gql } from '@apollo/client';
import { FEEDBACK_BASIC_INFOS } from '../fragments/FeedbackFragment';

export const POST_FEEDBACK = gql`
  mutation CreateFeedback($feedbackData: FeedbackInput!, $image: Upload) {
    createFeedback(feedbackData: $feedbackData, image: $image) {
      feedback {
        ...FeedbackBasicInfosFragment
      }
    }
  }
  ${FEEDBACK_BASIC_INFOS}
`;

export const PUT_FEEDBACK = gql`
  mutation UpdateFeedback(
    $id: ID!
    $feedbackData: FeedbackInput!
    $image: Upload
  ) {
    updateFeedback(id: $id, feedbackData: $feedbackData, image: $image) {
      feedback {
        ...FeedbackBasicInfosFragment
      }
    }
  }
  ${FEEDBACK_BASIC_INFOS}
`;

export const PUT_FEEDBACK_STATE = gql`
  mutation UpdateFeedbackState($id: ID!) {
    updateFeedbackState(id: $id) {
      done
      success
      message
      feedback {
        ...FeedbackBasicInfosFragment
      }
    }
  }
  ${FEEDBACK_BASIC_INFOS}
`;

export const DELETE_FEEDBACK = gql`
  mutation DeleteFeedback($id: ID!) {
    deleteFeedback(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;

export const MARK_FEEDBACKS_AS_SEEN = gql`
  mutation markFeedbacksAsSeen($ids: [ID]!) {
    markFeedbacksAsSeen(ids: $ids) {
      success
      done
      message
    }
  }
`;
