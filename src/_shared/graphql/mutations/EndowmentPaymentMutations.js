import { gql } from '@apollo/client';
import { ENDOWMENT_PAYMENT_BASIC_INFOS } from '../fragments/EndowmentPaymentFragment';

export const POST_ENDOWMENT_PAYMENT = gql`
  mutation CreateEndowmentPayment(
    $endowmentPaymentData: EndowmentPaymentInput!
    $files : [MediaInput]
    ) {
    createEndowmentPayment(endowmentPaymentData: $endowmentPaymentData, files: $files) {
      endowmentPayment {
        ...EndowmentPaymentBasicInfosFragment
      }
    }
  }
  ${ENDOWMENT_PAYMENT_BASIC_INFOS}
`;

export const PUT_ENDOWMENT_PAYMENT = gql`
  mutation UpdateEndowmentPayment(
    $id: ID!
    $endowmentPaymentData: EndowmentPaymentInput!
    $files : [MediaInput]
  ) {
    updateEndowmentPayment(id: $id, endowmentPaymentData: $endowmentPaymentData, files: $files) {
      endowmentPayment {
        ...EndowmentPaymentBasicInfosFragment
      }
    }
  }
  ${ENDOWMENT_PAYMENT_BASIC_INFOS}
`;

export const PUT_ENDOWMENT_PAYMENT_STATE = gql`
  mutation UpdateEndowmentPaymentState($id: ID!) {
    updateEndowmentPaymentState(id: $id) {
      done
      success
      message
      endowmentPayment {
        ...EndowmentPaymentBasicInfosFragment
      }
    }
  }
  ${ENDOWMENT_PAYMENT_BASIC_INFOS}
`;

export const PUT_ENDOWMENT_PAYMENT_FIELDS = gql`
  mutation UpdateEndowmentPaymentFields($id: ID!, $endowmentPaymentData: EndowmentPaymentFieldInput!) {
    updateEndowmentPaymentFields(id: $id, endowmentPaymentData: $endowmentPaymentData) {
      done
      success
      message
      endowmentPayment {
        ...EndowmentPaymentBasicInfosFragment
      }
    }
  }
  ${ENDOWMENT_PAYMENT_BASIC_INFOS}
`;

export const DELETE_ENDOWMENT_PAYMENT = gql`
  mutation DeleteEndowmentPayment($id: ID!) {
    deleteEndowmentPayment(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
