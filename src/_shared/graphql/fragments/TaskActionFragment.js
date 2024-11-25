// TaskActionFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { USER_BASIC_INFOS } from './UserFragment';

export const TASK_ACTION_MINI_INFOS = gql`
  fragment TaskActionMiniInfosFragment on TaskActionType {
    id
    description
    dueDate
    status
    isArchived
    employees{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const TASK_ACTION_BASIC_INFOS = gql`
  fragment TaskActionBasicInfosFragment on TaskActionType {
    ...TaskActionMiniInfosFragment
    creator{
      ...UserBasicInfosFragment
    }
    ticket{
      id
      title
      undesirableEvent{
        id
        title
      }
    }
  }
  ${TASK_ACTION_MINI_INFOS}
  ${USER_BASIC_INFOS}
`;

export const TASK_ACTION_DETAILS = gql`
  fragment TaskActionDetailsFragment on TaskActionType {
    ...TaskActionBasicInfosFragment
  }
  ${TASK_ACTION_BASIC_INFOS}
`;

export const TASK_ACTION_RECAP_DETAILS = gql`
  fragment TaskActionRecapDetailsFragment on TaskActionType {
    ...TaskActionBasicInfosFragment
  }
  ${TASK_ACTION_BASIC_INFOS}
`;
