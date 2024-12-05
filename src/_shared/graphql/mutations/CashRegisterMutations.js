import { gql } from '@apollo/client';
import { CASH_REGISTER_BASIC_INFOS } from '../fragments/CashRegisterFragment';

export const POST_CASH_REGISTER = gql`
  mutation CreateCashRegister(
    $cashRegisterData: CashRegisterInput!
  ) {
    createCashRegister(cashRegisterData: $cashRegisterData) {
      cashRegister {
        ...CashRegisterBasicInfosFragment
      }
    }
  }
  ${CASH_REGISTER_BASIC_INFOS}
`;

export const PUT_CASH_REGISTER = gql`
  mutation UpdateCashRegister(
    $id: ID!
    $cashRegisterData: CashRegisterInput!
  ) {
    updateCashRegister(
      id: $id
      cashRegisterData: $cashRegisterData
    ) {
      cashRegister {
        ...CashRegisterBasicInfosFragment
      }
    }
  }
  ${CASH_REGISTER_BASIC_INFOS}
`;

export const DELETE_CASH_REGISTER = gql`
  mutation DeleteCashRegister($id: ID!) {
    deleteCashRegister(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
