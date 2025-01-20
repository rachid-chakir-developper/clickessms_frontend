import { gql } from '@apollo/client';
import { ENDOWMENT_BASIC_INFOS } from '../fragments/EndowmentFragment';

export const POST_ENDOWMENT = gql`
  mutation CreateEndowment($endowmentData: EndowmentInput!) {
    createEndowment(endowmentData: $endowmentData) {
      endowment {
        ...EndowmentBasicInfosFragment
      }
    }
  }
  ${ENDOWMENT_BASIC_INFOS}
`;

export const PUT_ENDOWMENT = gql`
  mutation UpdateEndowment(
    $id: ID!
    $endowmentData: EndowmentInput!
  ) {
    updateEndowment(id: $id, endowmentData: $endowmentData) {
      endowment {
        ...EndowmentBasicInfosFragment
      }
    }
  }
  ${ENDOWMENT_BASIC_INFOS}
`;

export const PUT_ENDOWMENT_STATE = gql`
  mutation UpdateEndowmentState($id: ID!) {
    updateEndowmentState(id: $id) {
      done
      success
      message
      endowment {
        ...EndowmentBasicInfosFragment
      }
    }
  }
  ${ENDOWMENT_BASIC_INFOS}
`;

export const DELETE_ENDOWMENT = gql`
  mutation DeleteEndowment($id: ID!) {
    deleteEndowment(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
