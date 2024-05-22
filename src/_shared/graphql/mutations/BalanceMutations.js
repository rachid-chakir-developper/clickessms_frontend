import { gql } from '@apollo/client';
import { BALANCE_BASIC_INFOS } from '../fragments/BalanceFragment';

export const POST_BALANCE = gql`
  mutation CreateBalance(
    $balanceData: BalanceInput!
    $document: Upload
  ) {
    createBalance(balanceData: $balanceData, document: $document) {
      balance {
        ...BalanceBasicInfosFragment
      }
    }
  }
  ${BALANCE_BASIC_INFOS}
`;

export const PUT_BALANCE = gql`
  mutation UpdateBalance(
    $id: ID!
    $balanceData: BalanceInput!
    $document: Upload
  ) {
    updateBalance(
      id: $id
      balanceData: $balanceData
      document: $document
    ) {
      balance {
        ...BalanceBasicInfosFragment
      }
    }
  }
  ${BALANCE_BASIC_INFOS}
`;

export const DELETE_BALANCE = gql`
  mutation DeleteBalance($id: ID!) {
    deleteBalance(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
