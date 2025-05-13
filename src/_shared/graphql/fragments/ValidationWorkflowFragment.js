// ValidationWorkflowFragment.js

import { gql } from '@apollo/client';


export const VALIDATION_WORKFLOW_MINI_INFOS = gql`
  fragment ValidationWorkflowMiniInfosFragment on ValidationWorkflowType {
    requestType
    isActive
  }
`;

export const VALIDATION_WORKFLOW_BASIC_INFOS = gql`
  fragment ValidationWorkflowBasicInfosFragment on ValidationWorkflowType {
    ...ValidationWorkflowMiniInfosFragment
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
