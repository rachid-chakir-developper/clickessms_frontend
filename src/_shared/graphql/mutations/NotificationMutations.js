import { gql } from '@apollo/client';

export const MARK_NOTIFICATIONS_AS_SEEN = gql`
  mutation markNotificationsAsSeen($ids: [ID]!) {
    markNotificationsAsSeen(ids: $ids) {
      success
      done
      message
    }
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
