// MessageNotificationFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';

export const MSG_NOTIFICATION_ESTABLISHMENT_DETAILS = gql`
  fragment MessageNotificationEstablishmentTypeFragment on MessageNotificationEstablishmentType{
    id
    establishment{
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const MSG_NOTIFICATION_BASIC_INFOS = gql`
  fragment MessageNotificationBasicInfosFragment on MessageNotificationType {
    id
    image
    title
    messageNotificationType
    message
    isActive
    establishments {
      ...MessageNotificationEstablishmentTypeFragment
    }
  }
  ${MSG_NOTIFICATION_ESTABLISHMENT_DETAILS}
`;

export const MSG_NOTIFICATION_DETAILS = gql`
  fragment MessageNotificationDetailsFragment on MessageNotificationType {
    ...MessageNotificationBasicInfosFragment
  }
  ${MSG_NOTIFICATION_BASIC_INFOS}
`;

export const MSG_NOTIFICATION_RECAP_DETAILS = gql`
  fragment MessageNotificationRecapDetailsFragment on MessageNotificationType {
    ...MessageNotificationBasicInfosFragment
    createdAt
    updatedAt
  }
  ${MSG_NOTIFICATION_BASIC_INFOS}
`;
