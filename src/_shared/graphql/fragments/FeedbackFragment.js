// FeedbackFragment.js

import { gql } from '@apollo/client';


export const FEEDBACK_BASIC_INFOS = gql`
  fragment FeedbackBasicInfosFragment on FeedbackType {
    id
    image
    title
    feedbackModule
    message
    isActive
  }
`;

export const FEEDBACK_DETAILS = gql`
  fragment FeedbackDetailsFragment on FeedbackType {
    ...FeedbackBasicInfosFragment
  }
  ${FEEDBACK_BASIC_INFOS}
`;

export const FEEDBACK_RECAP_DETAILS = gql`
  fragment FeedbackRecapDetailsFragment on FeedbackType {
    ...FeedbackBasicInfosFragment
    createdAt
    updatedAt
  }
  ${FEEDBACK_BASIC_INFOS}
`;
