
import { gql } from '@apollo/client';
import { MESSAGE_BASIC_INFOS, MESSAGE_DETAILS } from '../fragments/ChatFragment';

export const ON_MESSAGE_ADDED = gql`
  subscription onMessageAdded($conversationId: ID!){
    onMessageAdded(conversationId: $conversationId){
      message{
        ...MessageDetailsFragment
      }
    }
  }
  ${MESSAGE_DETAILS}
`;

export const ON_MESSAGE_UPDATED = gql`
  subscription onMessageUpdated($conversationId: ID) {
    onMessageUpdated(conversationId: $conversationId) {
      message{
        ...MessageBasicInfosFragment
      }
    }
  }
  ${MESSAGE_BASIC_INFOS}
`;

export const ON_MESSAGE_DELETED = gql`
  subscription onMessageDeleted($conversationId: ID){
    onMessageDeleted(conversationId: $conversationId) {
      id
    }
  }
`;

// Similar subscriptions can be defined for Client and Employee entities.
