import { gql } from '@apollo/client';
import { CALL_BASIC_INFOS } from '../fragments/CallFragment';

export const POST_CALL = gql`
  mutation CreateCall($callData: CallInput!, $image: Upload) {
    createCall(callData: $callData, image: $image) {
      call {
        ...CallBasicInfosFragment
      }
    }
  }
  ${CALL_BASIC_INFOS}
`;

export const PUT_CALL = gql`
  mutation UpdateCall($id: ID!, $callData: CallInput!, $image: Upload) {
    updateCall(id: $id, callData: $callData, image: $image) {
      call {
        ...CallBasicInfosFragment
      }
    }
  }
  ${CALL_BASIC_INFOS}
`;

export const PUT_CALL_STATE = gql`
  mutation UpdateCallState($id: ID!) {
    updateCallState(id: $id) {
      done
      success
      message
      call {
        ...CallBasicInfosFragment
      }
    }
  }
  ${CALL_BASIC_INFOS}
`;

export const DELETE_CALL = gql`
  mutation DeleteCall($id: ID!) {
    deleteCall(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
