import { gql } from '@apollo/client';
import {
  CR_TRANSACTION_BASIC_INFOS,
  CR_TRANSACTION_DETAILS,
  CR_TRANSACTION_RECAP_DETAILS,
} from '../fragments/CashRegisterTransactionFragment';

export const GET_CR_TRANSACTION = gql`
  query GetCashRegisterTransaction($id: ID!) {
    cashRegisterTransaction(id: $id) {
      ...CashRegisterTransactionDetailsFragment
    }
  }
  ${CR_TRANSACTION_DETAILS}
`;

export const GET_CR_TRANSACTIONS = gql`
  query GetCashRegisterTransactions(
    $cashRegisterTransactionFilter: CashRegisterTransactionFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    cashRegisterTransactions(
      cashRegisterTransactionFilter: $cashRegisterTransactionFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CashRegisterTransactionBasicInfosFragment
      }
    }
  }
  ${CR_TRANSACTION_BASIC_INFOS}
`;

export const CR_TRANSACTION_RECAP = gql`
  query GetCashRegisterTransaction($id: ID!) {
    cashRegisterTransaction(id: $id) {
      ...CashRegisterTransactionRecapDetailsFragment
    }
  }
  ${CR_TRANSACTION_RECAP_DETAILS}
`;
// Add more cashRegisterTransaction-related queries here
