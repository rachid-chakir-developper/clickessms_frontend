import { gql } from '@apollo/client';
import { ADVANCE_BASIC_INFOS } from '../fragments/AdvanceFragment';

export const CREATE_ADVANCE = gql`
  mutation CreateAdvance($advanceData: AdvanceInput!) {
    createAdvance(advanceData: $advanceData) {
      advance {
        ...AdvanceBasicInfosFragment
      }
    }
  }
  ${ADVANCE_BASIC_INFOS}
`;

export const UPDATE_ADVANCE = gql`
  mutation UpdateAdvance($id: ID!, $advanceData: AdvanceInput!) {
    updateAdvance(id: $id, advanceData: $advanceData) {
      advance {
        ...AdvanceBasicInfosFragment
      }
    }
  }
  ${ADVANCE_BASIC_INFOS}
`;

export const VALIDATE_ADVANCE = gql`
  mutation ValidateAdvance($id: ID!, $status: String!, $comments: String) {
    validateAdvance(id: $id, status: $status, comments: $comments) {
      advance {
        ...AdvanceBasicInfosFragment
      }
      success
      message
    }
  }
  ${ADVANCE_BASIC_INFOS}
`;

export const DELETE_ADVANCE = gql`
  mutation DeleteAdvance($id: ID!) {
    deleteAdvance(id: $id) {
      advance {
        ...AdvanceBasicInfosFragment
      }
      id
      deleted
      success
      message
    }
  }
  ${ADVANCE_BASIC_INFOS}
`; 