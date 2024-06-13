import { gql } from '@apollo/client';
import { ACTION_PLAN_ACTION_BASIC_INFOS } from '../fragments/ActionPlanActionFragment';

export const POST_ACTION_PLAN_ACTION = gql`
  mutation CreateActionPlanAction(
    $actionPlanActionData: ActionPlanActionInput!
    $document: Upload
  ) {
    createActionPlanAction(actionPlanActionData: $actionPlanActionData, document: $document) {
      actionPlanAction {
        ...ActionPlanActionBasicInfosFragment
      }
    }
  }
  ${ACTION_PLAN_ACTION_BASIC_INFOS}
`;

export const PUT_ACTION_PLAN_ACTION = gql`
  mutation UpdateActionPlanAction(
    $id: ID!
    $actionPlanActionData: ActionPlanActionInput!
    $document: Upload
  ) {
    updateActionPlanAction(
      id: $id
      actionPlanActionData: $actionPlanActionData
      document: $document
    ) {
      actionPlanAction {
        ...ActionPlanActionBasicInfosFragment
      }
    }
  }
  ${ACTION_PLAN_ACTION_BASIC_INFOS}
`;

export const DELETE_ACTION_PLAN_ACTION = gql`
  mutation DeleteActionPlanAction($id: ID!) {
    deleteActionPlanAction(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
