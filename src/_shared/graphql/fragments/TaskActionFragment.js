// TaskActionFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const TASK_ACTION_BASIC_INFOS = gql`
  fragment TaskActionBasicInfosFragment on TaskActionType {
    id
    description
    dueDate
    status
    employees{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
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