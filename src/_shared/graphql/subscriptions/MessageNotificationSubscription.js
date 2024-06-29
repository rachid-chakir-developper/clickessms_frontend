import { gql } from '@apollo/client';
import {
  MSG_NOTIFICATION_BASIC_INFOS,
  MSG_NOTIFICATION_DETAILS,
} from '../fragments/MessageNotificationFragment';

export const ON_MSG_NOTIFICATION_ADDED = gql`
  subscription onMessageNotificationAdded {
    onMessageNotificationAdded {
      messageNotification {
        ...MessageNotificationDetailsFragment
      }
    }
  }
  ${MSG_NOTIFICATION_DETAILS}
`;

export const ON_MSG_NOTIFICATION_UPDATED = gql`
  subscription onMessageNotificationUpdated {
    onMessageNotificationUpdated {
      messageNotification {
        ...MessageNotificationBasicInfosFragment
      }
    }
  }
  ${MSG_NOTIFICATION_BASIC_INFOS}
`;

export const ON_MSG_NOTIFICATION_DELETED = gql`
  subscription onMessageNotificationDeleted {
    onMessageNotificationDeleted {
      id
    }
  }
`;

// Similar subscriptions can be defined for Client and Employee entities.
