import { gql } from '@apollo/client';
import {
  BANK_ACCOUNT_BASIC_INFOS,
  BANK_ACCOUNT_DETAILS,
  BANK_ACCOUNT_RECAP_DETAILS,
} from '../fragments/BankAccountFragment';

export const GET_BANK_ACCOUNT = gql`
  query GetBankAccount($id: ID!) {
    bankAccount(id: $id) {
      ...BankAccountDetailsFragment
    }
  }
  ${BANK_ACCOUNT_DETAILS}
`;

export const GET_BANK_ACCOUNTS = gql`
  query GetBankAccounts(
    $bankAccountFilter: BankAccountFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    bankAccounts(
      bankAccountFilter: $bankAccountFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...BankAccountBasicInfosFragment
      }
    }
  }
  ${BANK_ACCOUNT_BASIC_INFOS}
`;


export const BANK_ACCOUNT_RECAP = gql`
  query GetBankAccount($id: ID!) {
    bankAccount(id: $id) {
      ...BankAccountRecapDetailsFragment
    }
  }
  ${BANK_ACCOUNT_RECAP_DETAILS}
`;
// Add mor
// Add more bankAccount-related queries here
