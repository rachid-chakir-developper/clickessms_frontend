import { gql } from '@apollo/client';
import { ACTION_PLAN_OBJECTIVE_BASIC_INFOS } from '../fragments/ActionPlanObjectiveFragment';

export const POST_ACTION_PLAN_OBJECTIVE = gql`
  mutation CreateActionPlanObjective($actionPlanObjectiveData: ActionPlanObjectiveInput!) {
    createActionPlanObjective(actionPlanObjectiveData: $actionPlanObjectiveData) {
      actionPlanObjective {
        ...ActionPlanObjectiveBasicInfosFragment
      }
    }
  }
  ${ACTION_PLAN_OBJECTIVE_BASIC_INFOS}
`;

export const PUT_ACTION_PLAN_OBJECTIVE = gql`
  mutation UpdateActionPlanObjective($id: ID!, $actionPlanObjectiveData: ActionPlanObjectiveInput!) {
    updateActionPlanObjective(id: $id, actionPlanObjectiveData: $actionPlanObjectiveData) {
      actionPlanObjective {
        ...ActionPlanObjectiveBasicInfosFragment
      }
    }
  }
  ${ACTION_PLAN_OBJECTIVE_BASIC_INFOS}
`;

export const PUT_ACTION_PLAN_OBJECTIVE_STATE = gql`
  mutation UpdateActionPlanObjectiveState($id: ID!) {
    updateActionPlanObjectiveState(id: $id) {
      done
      success
      message
      actionPlanObjective {
        ...ActionPlanObjectiveBasicInfosFragment
      }
    }
  }
  ${ACTION_PLAN_OBJECTIVE_BASIC_INFOS}
`;

export const DELETE_ACTION_PLAN_OBJECTIVE = gql`
  mutation DeleteActionPlanObjective($id: ID!) {
    deleteActionPlanObjective(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
