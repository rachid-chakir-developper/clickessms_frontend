import { gql } from '@apollo/client';
import { NOTIFICATION_BASIC_INFOS, NOTIFICATION_DETAILS } from '../fragments/NotificationFragment';

export const ON_NOTIFICATION_ADDED = gql`
  subscription onNotificationAdded {
    onNotificationAdded {
      notification{
        ...NotificationDetailsFragment
      }
    }
  }
  ${NOTIFICATION_DETAILS}
`;

export const ON_NOTIFICATION_UPDATED = gql`
  subscription onNotificationUpdated {
    onNotificationUpdated {
      notification{
        ...NotificationBasicInfosFragment
      }
    }
  }
  ${NOTIFICATION_BASIC_INFOS}
`;

export const ON_NOTIFICATION_DELETED = gql`
  subscription onNotificationDeleted {
    onNotificationDeleted {
      id
    }
  }
`;

// Similar subscriptions can be defined for Client and Employee entities.
