// ActionPlanObjectiveFragment.js

import{ gql } from '@apollo/client';
import{ EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import{ ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';



export const ACTION_PLAN_OBJECTIVE_BASIC_INFOS = gql`
  fragment ActionPlanObjectiveBasicInfosFragment on ActionPlanObjectiveType{
    id
    number
    title
    priority
    status
    completionPercentage
    isActive
    establishments{
      ...EstablishmentMiniInfosFragment
    }
    folder{
      id
      number
      name
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;



export const ACTION_PLAN_OBJECTIVE_DECISION_DETAILS = gql`
  fragment ActionPlanObjectiveActionFragment on ActionPlanObjectiveActionType{
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

export const ACTION_PLAN_OBJECTIVE_DETAILS = gql`
  fragment ActionPlanObjectiveDetailsFragment on ActionPlanObjectiveType{
    ...ActionPlanObjectiveBasicInfosFragment
    description
    employee{
      ...EmployeeMiniInfosFragment
    }
    actions{
      ...ActionPlanObjectiveActionFragment
    }
  }
  ${ACTION_PLAN_OBJECTIVE_BASIC_INFOS}
  ${EMPLOYEE_MINI_INFOS}
  ${ACTION_PLAN_OBJECTIVE_DECISION_DETAILS}
`;

export const ACTION_PLAN_OBJECTIVE_RECAP_DETAILS = gql`
  fragment ActionPlanObjectiveRecapDetailsFragment on ActionPlanObjectiveType{
    ...ActionPlanObjectiveBasicInfosFragment
    description
    employee{
      ...EmployeeMiniInfosFragment
    }
    actions{
      ...ActionPlanObjectiveActionFragment
    }
    createdAt
    updatedAt
  }
  ${ACTION_PLAN_OBJECTIVE_BASIC_INFOS}
  ${EMPLOYEE_MINI_INFOS}
  ${ACTION_PLAN_OBJECTIVE_DECISION_DETAILS}
`;
