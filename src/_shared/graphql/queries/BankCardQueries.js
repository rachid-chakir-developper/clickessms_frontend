import { gql } from '@apollo/client';
import {
  BANK_CARD_BASIC_INFOS,
  BANK_CARD_DETAILS,
  BANK_CARD_RECAP_DETAILS,
} from '../fragments/BankCardFragment';

export const GET_BANK_CARD = gql`
  query GetBankCard($id: ID!) {
    bankCard(id: $id) {
      ...BankCardDetailsFragment
    }
  }
  ${BANK_CARD_DETAILS}
`;

export const GET_BANK_CARDS = gql`
  query GetBankCards(
    $bankCardFilter: BankCardFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    bankCards(
      bankCardFilter: $bankCardFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...BankCardBasicInfosFragment
      }
    }
  }
  ${BANK_CARD_BASIC_INFOS}
`;

export const BANK_CARD_RECAP = gql`
  query GetBankCard($id: ID!) {
    bankCard(id: $id) {
      ...BankCardRecapDetailsFragment
    }
  }
  ${BANK_CARD_RECAP_DETAILS}
`;
// Add more bankCard-related queries here
