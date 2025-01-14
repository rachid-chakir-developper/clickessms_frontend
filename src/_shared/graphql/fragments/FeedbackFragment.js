// FeedbackFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const SIGNATURE_DETAILS = gql`
  fragment SignatureTypeFragment on SignatureType {
    id
    base64Encoded
    image
    authorName
    authorPosition
    authorNumber
    authorEmail
    satisfaction
    comment
    author{
      ...EmployeeMiniInfosFragment
    }
    createdAt
    updatedAt
  }
  ${EMPLOYEE_MINI_INFOS}
`;

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
