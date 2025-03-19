import { gql } from '@apollo/client';
import {
    DEFAULT_SENT_EMAIL_BASIC_INFOS,
  SENT_EMAIL_BASIC_INFOS,
  SENT_EMAIL_DETAILS,
  SENT_EMAIL_RECAP_DETAILS,
} from '../fragments/SentEmailFragment';

export const GET_DEFAULT_SENT_EMAIL = gql`
  query GetDefaultSentEmail($defaultSentEmailFilter: DefaultSentEmailFilterInput) {
    defaultSentEmail(defaultSentEmailFilter: $defaultSentEmailFilter) {
      ...DefaultSentEmailBasicInfosFragment
    }
  }
  ${DEFAULT_SENT_EMAIL_BASIC_INFOS}
`;

export const GET_SENT_EMAIL = gql`
  query GetSentEmail($id: ID!) {
    sentEmail(id: $id) {
      ...SentEmailDetailsFragment
    }
  }
  ${SENT_EMAIL_DETAILS}
`;

export const GET_SENT_EMAILS = gql`
  query GetSentEmails(
    $sentEmailFilter: SentEmailFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    sentEmails(
      sentEmailFilter: $sentEmailFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...SentEmailBasicInfosFragment
      }
    }
  }
  ${SENT_EMAIL_BASIC_INFOS}
`;

export const SENT_EMAIL_RECAP = gql`
  query GetSentEmail($id: ID!) {
    sentEmail(id: $id) {
      ...SentEmailRecapDetailsFragment
    }
  }
  ${SENT_EMAIL_RECAP_DETAILS}
`;
// Add more sentEmail-related queries here
