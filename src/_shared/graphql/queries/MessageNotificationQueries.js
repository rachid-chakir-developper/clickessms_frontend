import { gql } from '@apollo/client';
import {
  MSG_NOTIFICATION_BASIC_INFOS,
  MSG_NOTIFICATION_DETAILS,
  MSG_NOTIFICATION_RECAP_DETAILS,
} from '../fragments/MessageNotificationFragment';

export const GET_MSG_NOTIFICATION = gql`
  query GetMessageNotification($id: ID!) {
    messageNotification(id: $id) {
      ...MessageNotificationDetailsFragment
    }
  }
  ${MSG_NOTIFICATION_DETAILS}
`;

export const GET_MSG_NOTIFICATIONS = gql`
  query GetMessageNotifications(
    $messageNotificationFilter: MessageNotificationFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    messageNotifications(
      messageNotificationFilter: $messageNotificationFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...MessageNotificationBasicInfosFragment
      }
    }
  }
  ${MSG_NOTIFICATION_BASIC_INFOS}
`;


export const MSG_NOTIFICATION_RECAP = gql`
  query GetMessageNotification($id: ID!) {
    messageNotification(id: $id) {
      ...MessageNotificationRecapDetailsFragment
    }
  }
  ${MSG_NOTIFICATION_RECAP_DETAILS}
`;
// Add mor
// Add more messageNotification-related queries here
