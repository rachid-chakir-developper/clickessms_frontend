import { gql } from '@apollo/client';
import {
  BALANCE_BASIC_INFOS,
  BALANCE_DETAILS,
  BALANCE_RECAP_DETAILS,
} from '../fragments/BalanceFragment';

export const GET_BALANCE = gql`
  query GetBalance($id: ID!) {
    balance(id: $id) {
      ...BalanceDetailsFragment
    }
  }
  ${BALANCE_DETAILS}
`;

export const GET_BALANCES = gql`
  query GetBalances(
    $balanceFilter: BalanceFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    balances(
      balanceFilter: $balanceFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...BalanceBasicInfosFragment
      }
    }
  }
  ${BALANCE_BASIC_INFOS}
`;

export const BALANCE_RECAP = gql`
  query GetBalance($id: ID!) {
    balance(id: $id) {
      ...BalanceRecapDetailsFragment
    }
  }
  ${BALANCE_RECAP_DETAILS}
`;
// Add more balance-related queries here
