import { gql } from '@apollo/client';
import { SENT_EMAIL_BASIC_INFOS } from '../fragments/SentEmailFragment';
import { DEFAULT_SENT_EMAIL_BASIC_INFOS } from '../fragments/SentEmailFragment';


export const SEND_THE_EMAIL = gql`
  mutation SendTheEmail($sentEmailData: SentEmailInput!) {
    sendTheEmail(sentEmailData: $sentEmailData) {
      success
      sent
      sentEmail{
        ...DefaultSentEmailBasicInfosFragment
      }
    }
  }
    ${DEFAULT_SENT_EMAIL_BASIC_INFOS}
`;

export const POST_SENT_EMAIL = gql`
  mutation CreateSentEmail(
    $sentEmailData: SentEmailInput!
  ) {
    createSentEmail(sentEmailData: $sentEmailData) {
      sentEmail {
        ...SentEmailBasicInfosFragment
      }
    }
  }
  ${SENT_EMAIL_BASIC_INFOS}
`;

export const PUT_SENT_EMAIL = gql`
  mutation UpdateSentEmail(
    $id: ID!
    $sentEmailData: SentEmailInput!
  ) {
    updateSentEmail(
      id: $id
      sentEmailData: $sentEmailData
    ) {
      sentEmail {
        ...SentEmailBasicInfosFragment
      }
    }
  }
  ${SENT_EMAIL_BASIC_INFOS}
`;

export const DELETE_SENT_EMAIL = gql`
  mutation DeleteSentEmail($id: ID!) {
    deleteSentEmail(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
