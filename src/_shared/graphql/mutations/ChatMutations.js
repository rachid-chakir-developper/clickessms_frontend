import { gql } from '@apollo/client';
import {
  CONVERSATION_DETAILS,
  MESSAGE_BASIC_INFOS,
} from '../fragments/ChatFragment';

export const POST_CONVERSATION = gql`
  mutation CreateConversation($conversationData: ConversationInput!) {
    createConversation(conversationData: $conversationData) {
      success
      done
      message
      conversation {
        ...ConversationBasicInfosFragment
      }
    }
  }
  ${CONVERSATION_DETAILS}
`;

export const PUT_CONVERSATION = gql`
  mutation UpdateConversation($id: ID!, $conversationData: ConversationInput!) {
    updateConversation(id: $id, conversationData: $conversationData) {
      success
      done
      message
      conversation {
        ...ConversationBasicInfosFragment
      }
    }
  }
  ${CONVERSATION_DETAILS}
`;

export const DELETE_CONVERSATION = gql`
  mutation DeleteConversation($id: ID!) {
    deleteConversation(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
export const POST_MESSAGE = gql`
  mutation CreateMessage($messageData: MessageInput!) {
    createMessage(messageData: $messageData) {
      success
      done
      messageResponse
      message {
        ...MessageBasicInfosFragment
      }
    }
  }
  ${MESSAGE_BASIC_INFOS}
`;

export const PUT_MESSAGE = gql`
  mutation UpdateMessage($id: ID!, $messageData: MessageInput!) {
    updateMessage(id: $id, messageData: $messageData) {
      success
      done
      messageResponse
      message {
        ...MessageBasicInfosFragment
      }
    }
  }
  ${MESSAGE_BASIC_INFOS}
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      success
      deleted
      messageResponse
    }
  }
`;
