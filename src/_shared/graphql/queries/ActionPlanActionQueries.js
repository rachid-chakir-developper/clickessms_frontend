import { gql } from '@apollo/client';
import {
  ACTION_PLAN_ACTION_BASIC_INFOS,
  ACTION_PLAN_ACTION_DETAILS,
  ACTION_PLAN_ACTION_RECAP_DETAILS,
} from '../fragments/ActionPlanActionFragment';

export const GET_ACTION_PLAN_ACTION = gql`
  query GetActionPlanAction($id: ID!) {
    actionPlanAction(id: $id) {
      ...ActionPlanActionDetailsFragment
    }
  }
  ${ACTION_PLAN_ACTION_DETAILS}
`;

export const GET_ACTION_PLAN_ACTIONS = gql`
  query GetActionPlanActions(
    $actionPlanActionFilter: ActionPlanActionFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    actionPlanActions(
      actionPlanActionFilter: $actionPlanActionFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...ActionPlanActionBasicInfosFragment
      }
    }
  }
  ${ACTION_PLAN_ACTION_BASIC_INFOS}
`;

export const ACTION_PLAN_ACTION_RECAP = gql`
  query GetActionPlanAction($id: ID!) {
    actionPlanAction(id: $id) {
      ...ActionPlanActionRecapDetailsFragment
    }
  }
  ${ACTION_PLAN_ACTION_RECAP_DETAILS}
`;
// Add more actionPlanAction-related queries here
