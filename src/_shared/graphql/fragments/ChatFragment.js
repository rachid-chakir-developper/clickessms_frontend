// MessageFragment.js

import { gql } from '@apollo/client';
import { USER_BASIC_INFOS } from './UserFragment';

export const PARTICIPANT_BASIC_INFOS = gql`
  fragment ParticipantConversationBasicInfosFragment on ParticipantConversationType {
    id
    user{
        ...UserBasicInfosFragment
      }
    createdAt
    updatedAt
  }
  ${USER_BASIC_INFOS}
`;

export const MESSAGE_BASIC_INFOS = gql`
  fragment MessageBasicInfosFragment on MessageType {
    id
    sender{
        ...UserBasicInfosFragment
      }
    isSentByMe
    text
    isRead
    isSeen
    createdAt
  }
  ${USER_BASIC_INFOS}
`;

export const MESSAGE_DETAILS = gql`
  fragment MessageDetailsFragment on MessageType {
    ...MessageBasicInfosFragment
    updatedAt
  }
  ${MESSAGE_BASIC_INFOS}
`;

export const CONVERSATION_DETAILS = gql`
  fragment ConversationDetailsFragment on ConversationType {
    id
    creator{
        ...UserBasicInfosFragment
      }
    participants{
        ...ParticipantConversationBasicInfosFragment
    }
    lastMessage{
      ...MessageDetailsFragment
    }
    notSeenCount
    createdAt
    updatedAt
  }
  ${USER_BASIC_INFOS}
  ${PARTICIPANT_BASIC_INFOS}
  ${MESSAGE_DETAILS}
`;
