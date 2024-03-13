import { gql } from '@apollo/client';
import { CONVERSATION_DETAILS, MESSAGE_BASIC_INFOS, MESSAGE_DETAILS } from '../fragments/ChatFragment';

export const GET_CONVERSATION = gql`
  query GetConversation($id: ID!) {
    conversation(id: $id) {
      ...ConversationDetailsFragment
    }
  }
  ${CONVERSATION_DETAILS}
`;

export const GET_CONVERSATIONS = gql`
  query GetConversations($offset: Int, $limit: Int, $page: Int){
    conversations(offset : $offset, limit : $limit, page : $page){
      totalCount
      notSeenCount
      nodes{
        ...ConversationDetailsFragment
      }
    }
  }
  ${CONVERSATION_DETAILS}
`;

// Add more conversation-related queries here

export const GET_MESSAGE = gql`
  query GetMessage($id: ID!) {
    message(id: $id) {
      ...MessageDetailsFragment
    }
  }
  ${MESSAGE_DETAILS}
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID , $participantId: ID, $offset: Int, $limit: Int, $page: Int){
    messages(conversationId : $conversationId, participantId : $participantId, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...MessageBasicInfosFragment
      }
    }
  }
  ${MESSAGE_BASIC_INFOS}
`;

// Add more message-related queries here
