import { gql } from '@apollo/client';
import {
  CASH_REGISTER_BASIC_INFOS,
  CASH_REGISTER_DETAILS,
  CASH_REGISTER_RECAP_DETAILS,
} from '../fragments/CashRegisterFragment';

export const GET_CASH_REGISTER = gql`
  query GetCashRegister($id: ID!) {
    cashRegister(id: $id) {
      ...CashRegisterDetailsFragment
    }
  }
  ${CASH_REGISTER_DETAILS}
`;

export const GET_CASH_REGISTERS = gql`
  query GetCashRegisters(
    $cashRegisterFilter: CashRegisterFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    cashRegisters(
      cashRegisterFilter: $cashRegisterFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CashRegisterBasicInfosFragment
      }
    }
  }
  ${CASH_REGISTER_BASIC_INFOS}
`;

export const CASH_REGISTER_RECAP = gql`
  query GetCashRegister($id: ID!) {
    cashRegister(id: $id) {
      ...CashRegisterRecapDetailsFragment
    }
  }
  ${CASH_REGISTER_RECAP_DETAILS}
`;
// Add more cashRegister-related queries here
