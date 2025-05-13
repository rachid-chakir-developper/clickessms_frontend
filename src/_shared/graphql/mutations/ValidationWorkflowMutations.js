import { gql } from '@apollo/client';
import { VALIDATION_WORKFLOW_BASIC_INFOS } from '../fragments/ValidationWorkflowFragment';

export const POST_VALIDATION_WORKFLOW = gql`
  mutation CreateValidationWorkflow(
    $validationWorkflowData: ValidationWorkflowInput!
    $photo: Upload
    $coverImage: Upload
  ) {
    createValidationWorkflow(
      validationWorkflowData: $validationWorkflowData
      photo: $photo
      coverImage: $coverImage
    ) {
      validationWorkflow {
        ...ValidationWorkflowBasicInfosFragment
      }
    }
  }
  ${VALIDATION_WORKFLOW_BASIC_INFOS}
`;

export const PUT_VALIDATION_WORKFLOW = gql`
  mutation UpdateValidationWorkflow(
    $id: ID!
    $validationWorkflowData: ValidationWorkflowInput!
    $photo: Upload
    $coverImage: Upload
  ) {
    updateValidationWorkflow(
      id: $id
      validationWorkflowData: $validationWorkflowData
      photo: $photo
      coverImage: $coverImage
    ) {
      validationWorkflow {
        ...ValidationWorkflowBasicInfosFragment
      }
    }
  }
  ${VALIDATION_WORKFLOW_BASIC_INFOS}
`;

export const PUT_VALIDATION_WORKFLOW_STATE = gql`
  mutation UpdateValidationWorkflowState($id: ID!) {
    updateValidationWorkflowState(id: $id) {
      done
      success
      message
      validationWorkflow {
        ...ValidationWorkflowBasicInfosFragment
      }
    }
  }
  ${VALIDATION_WORKFLOW_BASIC_INFOS}
`;

export const DELETE_VALIDATION_WORKFLOW = gql`
  mutation DeleteValidationWorkflow($id: ID!) {
    deleteValidationWorkflow(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
