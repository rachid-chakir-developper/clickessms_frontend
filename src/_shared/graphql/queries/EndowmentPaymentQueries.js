import { gql } from '@apollo/client';
import {
  ENDOWMENT_PAYMENT_BASIC_INFOS,
  ENDOWMENT_PAYMENT_DETAILS,
  ENDOWMENT_PAYMENT_RECAP_DETAILS,
} from '../fragments/EndowmentPaymentFragment';

export const GET_ENDOWMENT_PAYMENT = gql`
  query GetEndowmentPayment($id: ID!) {
    endowmentPayment(id: $id) {
      ...EndowmentPaymentDetailsFragment
    }
  }
  ${ENDOWMENT_PAYMENT_DETAILS}
`;

export const GET_ENDOWMENT_PAYMENTS = gql`
  query GetEndowmentPayments(
    $endowmentPaymentFilter: EndowmentPaymentFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    endowmentPayments(
      endowmentPaymentFilter: $endowmentPaymentFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...EndowmentPaymentBasicInfosFragment
      }
    }
  }
  ${ENDOWMENT_PAYMENT_BASIC_INFOS}
`;

export const GET_RECAP_ENDOWMENT_PAYMENT = gql`
  query GetEndowmentPayment($id: ID!) {
    endowmentPayment(id: $id) {
      ...EndowmentPaymentRecapDetailsFragment
    }
  }
  ${ENDOWMENT_PAYMENT_RECAP_DETAILS}
`;