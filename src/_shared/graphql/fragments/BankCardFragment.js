// BankCardFragment.js

import { gql } from '@apollo/client';
import { BANK_ACCOUNT_BASIC_INFOS } from './BankAccountFragment';

export const BANK_CARD_BASIC_INFOS = gql`
  fragment BankCardBasicInfosFragment on BankCardType {
    id
    number
    image
    title
    cardNumber
    cardholderName
    expirationDate
    cvv
    isActive
    bankAccount{
      ...BankAccountBasicInfosFragment
    }
  }
  ${BANK_ACCOUNT_BASIC_INFOS}
`;

export const BANK_CARD_DETAILS = gql`
  fragment BankCardDetailsFragment on BankCardType {
    ...BankCardBasicInfosFragment
  }
  ${BANK_CARD_BASIC_INFOS}
`;

export const BANK_CARD_RECAP_DETAILS = gql`
  fragment BankCardRecapDetailsFragment on BankCardType {
    ...BankCardBasicInfosFragment
    createdAt
    updatedAt
  }
  ${BANK_CARD_BASIC_INFOS}
`;
