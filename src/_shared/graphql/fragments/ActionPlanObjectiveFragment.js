// ActionPlanObjectiveFragment.js

import{ gql } from '@apollo/client';
import{ EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import{ ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { ACTION_PLAN_ACTION_DETAILS } from './ActionPlanActionFragment';

export const ACTION_PLAN_OBJECTIVE_MINI_INFOS = gql`
  fragment ActionPlanObjectiveMiniInfosFragment on ActionPlanObjectiveType{
    id
    number
    title
    priority
    status
    completionPercentage
    isActive
  }
`;

export const ACTION_PLAN_OBJECTIVE_BASIC_INFOS = gql`
  fragment ActionPlanObjectiveBasicInfosFragment on ActionPlanObjectiveType{
    ...ActionPlanObjectiveMiniInfosFragment
    establishments{
      ...EstablishmentMiniInfosFragment
    }
    undesirableEvent {
      id
      title
    }
    folder{
      id
      number
      name
    }
  }
  ${ACTION_PLAN_OBJECTIVE_MINI_INFOS}
  ${ESTABLISHMENT_MINI_INFOS}
`;


export const ACTION_PLAN_OBJECTIVE_DETAILS = gql`
  fragment ActionPlanObjectiveDetailsFragment on ActionPlanObjectiveType{
    ...ActionPlanObjectiveBasicInfosFragment
    description
    employee{
      ...EmployeeMiniInfosFragment
    }
    actions{
      ...ActionPlanActionDetailsFragment
    }
  }
  ${ACTION_PLAN_OBJECTIVE_BASIC_INFOS}
  ${EMPLOYEE_MINI_INFOS}
  ${ACTION_PLAN_ACTION_DETAILS}
`;

export const ACTION_PLAN_OBJECTIVE_RECAP_DETAILS = gql`
  fragment ActionPlanObjectiveRecapDetailsFragment on ActionPlanObjectiveType{
    ...ActionPlanObjectiveBasicInfosFragment
    description
    employee{
      ...EmployeeMiniInfosFragment
    }
    actions{
      ...ActionPlanActionDetailsFragment
    }
    createdAt
    updatedAt
  }
  ${ACTION_PLAN_OBJECTIVE_BASIC_INFOS}
  ${EMPLOYEE_MINI_INFOS}
  ${ACTION_PLAN_ACTION_DETAILS}
`;
