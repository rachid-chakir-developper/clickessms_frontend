// ActionPlanActionFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const ACTION_PLAN_ACTION_BASIC_INFOS = gql`
  fragment ActionPlanActionBasicInfosFragment on ActionPlanActionType {
    id
    action
    dueDate
    status
    employees{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const ACTION_PLAN_ACTION_DETAILS = gql`
  fragment ActionPlanActionDetailsFragment on ActionPlanActionType {
    ...ActionPlanActionBasicInfosFragment
  }
  ${ACTION_PLAN_ACTION_BASIC_INFOS}
`;

export const ACTION_PLAN_ACTION_RECAP_DETAILS = gql`
  fragment ActionPlanActionRecapDetailsFragment on ActionPlanActionType {
    ...ActionPlanActionBasicInfosFragment
  }
  ${ACTION_PLAN_ACTION_BASIC_INFOS}
`;
