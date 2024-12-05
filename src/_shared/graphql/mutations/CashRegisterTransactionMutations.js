import { gql } from '@apollo/client';
import { CR_TRANSACTION_BASIC_INFOS } from '../fragments/CashRegisterTransactionFragment';

export const POST_CR_TRANSACTION = gql`
  mutation CreateCashRegisterTransaction(
    $cashRegisterTransactionData: CashRegisterTransactionInput!
    $document: Upload
  ) {
    createCashRegisterTransaction(cashRegisterTransactionData: $cashRegisterTransactionData, document: $document) {
      cashRegisterTransaction {
        ...CashRegisterTransactionBasicInfosFragment
      }
    }
  }
  ${CR_TRANSACTION_BASIC_INFOS}
`;

export const PUT_CR_TRANSACTION = gql`
  mutation UpdateCashRegisterTransaction(
    $id: ID!
    $cashRegisterTransactionData: CashRegisterTransactionInput!
    $document: Upload
  ) {
    updateCashRegisterTransaction(
      id: $id
      cashRegisterTransactionData: $cashRegisterTransactionData
      document: $document
    ) {
      cashRegisterTransaction {
        ...CashRegisterTransactionBasicInfosFragment
      }
    }
  }
  ${CR_TRANSACTION_BASIC_INFOS}
`;

export const DELETE_CR_TRANSACTION = gql`
  mutation DeleteCashRegisterTransaction($id: ID!) {
    deleteCashRegisterTransaction(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
