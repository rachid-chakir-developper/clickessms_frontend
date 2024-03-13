// NotificationFragment.js

import { gql } from '@apollo/client';
import { USER_BASIC_INFOS } from './UserFragment';
import { TASK_MINI_BASIC_INFOS } from './TaskFragment';

export const NOTIFICATION_BASIC_INFOS = gql`
  fragment NotificationBasicInfosFragment on NotificationType {
    id
    sender{
        ...UserBasicInfosFragment
      }
	recipient{
        ...UserBasicInfosFragment
      }
	notificationType
	title
	message
	isRead
	isSeen
	task{
        ...TaskMiniBasicInfosFragment
    }
    createdAt
  }
  ${USER_BASIC_INFOS}
  ${TASK_MINI_BASIC_INFOS}
`;

export const NOTIFICATION_DETAILS = gql`
  fragment NotificationDetailsFragment on NotificationType {
    ...NotificationBasicInfosFragment
    updatedAt
  }
  ${NOTIFICATION_BASIC_INFOS}
`;
