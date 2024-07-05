import { gql } from '@apollo/client';
import {
  FEEDBACK_BASIC_INFOS,
  FEEDBACK_DETAILS,
  FEEDBACK_RECAP_DETAILS,
} from '../fragments/FeedbackFragment';

export const GET_FEEDBACK = gql`
  query GetFeedback($id: ID!) {
    feedback(id: $id) {
      ...FeedbackDetailsFragment
    }
  }
  ${FEEDBACK_DETAILS}
`;

export const GET_FEEDBACKS = gql`
  query GetFeedbacks(
    $feedbackFilter: FeedbackFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    feedbacks(
      feedbackFilter: $feedbackFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...FeedbackRecapDetailsFragment
      }
    }
  }
  ${FEEDBACK_RECAP_DETAILS}
`;


export const FEEDBACK_RECAP = gql`
  query GetFeedback($id: ID!) {
    feedback(id: $id) {
      ...FeedbackRecapDetailsFragment
    }
  }
  ${FEEDBACK_RECAP_DETAILS}
`;
// Add mor
// Add more feedback-related queries here
