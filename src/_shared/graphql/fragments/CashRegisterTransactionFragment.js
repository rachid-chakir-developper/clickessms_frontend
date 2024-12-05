// CashRegisterTransactionFragment.js

import { gql } from '@apollo/client';
import { CASH_REGISTER_BASIC_INFOS } from './CashRegisterFragment';

export const CR_TRANSACTION_BASIC_INFOS = gql`
  fragment CashRegisterTransactionBasicInfosFragment on CashRegisterTransactionType {
    id
    number
    name
    document
    date
    amount
    cashRegister{
      ...CashRegisterBasicInfosFragment
    }
  }
  ${CASH_REGISTER_BASIC_INFOS}
`;

export const CR_TRANSACTION_DETAILS = gql`
  fragment CashRegisterTransactionDetailsFragment on CashRegisterTransactionType {
    ...CashRegisterTransactionBasicInfosFragment
  }
  ${CR_TRANSACTION_BASIC_INFOS}
`;

export const CR_TRANSACTION_RECAP_DETAILS = gql`
  fragment CashRegisterTransactionRecapDetailsFragment on CashRegisterTransactionType {
    ...CashRegisterTransactionBasicInfosFragment
    createdAt
    updatedAt
  }
  ${CR_TRANSACTION_BASIC_INFOS}
`;
