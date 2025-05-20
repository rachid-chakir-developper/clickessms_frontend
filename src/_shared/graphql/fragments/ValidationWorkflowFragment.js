// ValidationWorkflowFragment.js

import { gql } from '@apollo/client';


export const VALIDATION_WORKFLOW_MINI_INFOS = gql`
  fragment ValidationWorkflowMiniInfosFragment on ValidationWorkflowType {
    id
    requestType
    description
    isActive
  }
`;

export const VALIDATION_WORKFLOW_BASIC_INFOS = gql`
  fragment ValidationWorkflowBasicInfosFragment on ValidationWorkflowType {
    ...ValidationWorkflowMiniInfosFragment
    validationSteps {
      id
      order
      comment
      validationRules{
        id
        validatorType
        targetEmployeeGroups {
          id
          name
        }
        targetEmployees {
          id
          firstName
          lastName
        }
        targetRoles
        targetPositions{
          id
          name
        }
        validatorEmployees {
          id
          firstName
          lastName
        }
        validatorRoles
        validatorPositions{
          id
          name
        }
      }
      fallbackRules {
        id
        fallbackType
        order
      }
    }
  }
  ${VALIDATION_WORKFLOW_MINI_INFOS}
`;

export const VALIDATION_WORKFLOW_DETAILS = gql`
  fragment ValidationWorkflowDetailsFragment on ValidationWorkflowType {
    ...ValidationWorkflowBasicInfosFragment
    isActive
  }
  ${VALIDATION_WORKFLOW_BASIC_INFOS}
`;


