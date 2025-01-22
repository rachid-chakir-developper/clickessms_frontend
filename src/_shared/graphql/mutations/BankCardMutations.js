import { gql } from '@apollo/client';
import { BANK_CARD_BASIC_INFOS } from '../fragments/BankCardFragment';

export const POST_BANK_CARD = gql`
  mutation CreateBankCard(
    $bankCardData: BankCardInput!
    $image: Upload
  ) {
    createBankCard(bankCardData: $bankCardData, image: $image) {
      bankCard {
        ...BankCardBasicInfosFragment
      }
    }
  }
  ${BANK_CARD_BASIC_INFOS}
`;

export const PUT_BANK_CARD = gql`
  mutation UpdateBankCard(
    $id: ID!
    $bankCardData: BankCardInput!
    $image: Upload
  ) {
    updateBankCard(
      id: $id
      bankCardData: $bankCardData
      image: $image
    ) {
      bankCard {
        ...BankCardBasicInfosFragment
      }
    }
  }
  ${BANK_CARD_BASIC_INFOS}
`;

export const DELETE_BANK_CARD = gql`
  mutation DeleteBankCard($id: ID!) {
    deleteBankCard(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
