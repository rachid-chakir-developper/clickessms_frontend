// BalanceFragment.js

import { gql } from '@apollo/client';
import { BANK_ACCOUNT_BASIC_INFOS } from './BankAccountFragment';

export const BALANCE_BASIC_INFOS = gql`
  fragment BalanceBasicInfosFragment on BalanceType {
    id
    number
    name
    document
    date
    amount
    bankAccount{
      ...BankAccountBasicInfosFragment
    }
  }
  ${BANK_ACCOUNT_BASIC_INFOS}
`;

export const BALANCE_DETAILS = gql`
  fragment BalanceDetailsFragment on BalanceType {
    ...BalanceBasicInfosFragment
  }
  ${BALANCE_BASIC_INFOS}
`;

export const BALANCE_RECAP_DETAILS = gql`
  fragment BalanceRecapDetailsFragment on BalanceType {
    ...BalanceBasicInfosFragment
    createdAt
    updatedAt
  }
  ${BALANCE_BASIC_INFOS}
`;
