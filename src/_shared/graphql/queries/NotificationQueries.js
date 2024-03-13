import { gql } from '@apollo/client';
import { NOTIFICATION_BASIC_INFOS, NOTIFICATION_DETAILS } from '../fragments/NotificationFragment';

export const GET_NOTIFICATION = gql`
  query GetNotification($id: ID!) {
    notification(id: $id) {
      ...NotificationDetailsFragment
    }
  }
  ${NOTIFICATION_DETAILS}
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($offset: Int, $limit: Int, $page: Int){
    notifications(offset : $offset, limit : $limit, page : $page){
      totalCount
      notSeenCount
      nodes{
        ...NotificationBasicInfosFragment
      }
    }
  }
  ${NOTIFICATION_BASIC_INFOS}
`;

// Add more notification-related queries here
