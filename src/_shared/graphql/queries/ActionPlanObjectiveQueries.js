import { gql } from '@apollo/client';
import {
  ACTION_PLAN_OBJECTIVE_BASIC_INFOS,
  ACTION_PLAN_OBJECTIVE_DETAILS,
  ACTION_PLAN_OBJECTIVE_RECAP_DETAILS,
} from '../fragments/ActionPlanObjectiveFragment';

export const GET_ACTION_PLAN_OBJECTIVE = gql`
  query GetActionPlanObjective($id: ID!) {
    actionPlanObjective(id: $id) {
      ...ActionPlanObjectiveDetailsFragment
    }
  }
  ${ACTION_PLAN_OBJECTIVE_DETAILS}
`;

export const GET_ACTION_PLAN_OBJECTIVES = gql`
  query GetActionPlanObjectives(
    $actionPlanObjectiveFilter: ActionPlanObjectiveFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    actionPlanObjectives(
      actionPlanObjectiveFilter: $actionPlanObjectiveFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...ActionPlanObjectiveBasicInfosFragment
      }
    }
  }
  ${ACTION_PLAN_OBJECTIVE_BASIC_INFOS}
`;

export const ACTION_PLAN_OBJECTIVE_RECAP = gql`
  query GetActionPlanObjective($id: ID!) {
    actionPlanObjective(id: $id) {
      ...ActionPlanObjectiveRecapDetailsFragment
      createdAt
      updatedAt
    }
  }
  ${ACTION_PLAN_OBJECTIVE_RECAP_DETAILS}
`;
// Add more actionPlanObjective-related queries here
