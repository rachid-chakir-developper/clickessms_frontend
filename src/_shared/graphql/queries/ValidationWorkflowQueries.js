import { gql } from '@apollo/client';
import {
  VALIDATION_WORKFLOW_BASIC_INFOS,
  VALIDATION_WORKFLOW_DETAILS,
} from '../fragments/ValidationWorkflowFragment';

export const GET_VALIDATION_WORKFLOW = gql`
  query GetValidationWorkflow($id: ID!) {
    validationWorkflow(id: $id) {
      ...ValidationWorkflowDetailsFragment
    }
  }
  ${VALIDATION_WORKFLOW_DETAILS}
`;

export const GET_VALIDATION_WORKFLOWS = gql`
  query GetValidationWorkflows(
    $validationWorkflowFilter: ValidationWorkflowFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    validationWorkflows(
      validationWorkflowFilter: $validationWorkflowFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...ValidationWorkflowBasicInfosFragment
      }
    }
  }
  ${VALIDATION_WORKFLOW_BASIC_INFOS}
`;

// Add more validationWorkflow-related queries here
