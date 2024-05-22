import { gql } from '@apollo/client';
import { BANK_ACCOUNT_BASIC_INFOS } from '../fragments/BankAccountFragment';

export const POST_BANK_ACCOUNT = gql`
  mutation CreateBankAccount($bankAccountData: BankAccountInput!, $image: Upload) {
    createBankAccount(bankAccountData: $bankAccountData, image: $image) {
      bankAccount {
        ...BankAccountBasicInfosFragment
      }
    }
  }
  ${BANK_ACCOUNT_BASIC_INFOS}
`;

export const PUT_BANK_ACCOUNT = gql`
  mutation UpdateBankAccount(
    $id: ID!
    $bankAccountData: BankAccountInput!
    $image: Upload
  ) {
    updateBankAccount(id: $id, bankAccountData: $bankAccountData, image: $image) {
      bankAccount {
        ...BankAccountBasicInfosFragment
      }
    }
  }
  ${BANK_ACCOUNT_BASIC_INFOS}
`;

export const PUT_BANK_ACCOUNT_STATE = gql`
  mutation UpdateBankAccountState($id: ID!) {
    updateBankAccountState(id: $id) {
      done
      success
      message
      bankAccount {
        ...BankAccountBasicInfosFragment
      }
    }
  }
  ${BANK_ACCOUNT_BASIC_INFOS}
`;

export const DELETE_BANK_ACCOUNT = gql`
  mutation DeleteBankAccount($id: ID!) {
    deleteBankAccount(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
