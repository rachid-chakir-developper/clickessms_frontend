import { gql } from '@apollo/client';
import { MSG_NOTIFICATION_BASIC_INFOS } from '../fragments/MessageNotificationFragment';

export const POST_MSG_NOTIFICATION = gql`
  mutation CreateMessageNotification($messageNotificationData: MessageNotificationInput!, $image: Upload) {
    createMessageNotification(messageNotificationData: $messageNotificationData, image: $image) {
      messageNotification {
        ...MessageNotificationBasicInfosFragment
      }
    }
  }
  ${MSG_NOTIFICATION_BASIC_INFOS}
`;

export const PUT_MSG_NOTIFICATION = gql`
  mutation UpdateMessageNotification(
    $id: ID!
    $messageNotificationData: MessageNotificationInput!
    $image: Upload
  ) {
    updateMessageNotification(id: $id, messageNotificationData: $messageNotificationData, image: $image) {
      messageNotification {
        ...MessageNotificationBasicInfosFragment
      }
    }
  }
  ${MSG_NOTIFICATION_BASIC_INFOS}
`;

export const PUT_MSG_NOTIFICATION_STATE = gql`
  mutation UpdateMessageNotificationState($id: ID!) {
    updateMessageNotificationState(id: $id) {
      done
      success
      message
      messageNotification {
        ...MessageNotificationBasicInfosFragment
      }
    }
  }
  ${MSG_NOTIFICATION_BASIC_INFOS}
`;

export const DELETE_MSG_NOTIFICATION = gql`
  mutation DeleteMessageNotification($id: ID!) {
    deleteMessageNotification(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
