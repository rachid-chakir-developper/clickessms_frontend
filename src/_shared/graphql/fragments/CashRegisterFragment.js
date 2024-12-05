// CashRegisterFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const CASH_REGISTER_ESTABLISHMENT_DETAILS = gql`
  fragment CashRegisterEstablishmentFragment on CashRegisterEstablishmentType {
    id
    establishment{
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const MANAGER_CASH_REGISTER_ITEM_DETAILS = gql`
  fragment CashRegisterManagerFragment on CashRegisterManagerType {
    id
    employee{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const CASH_REGISTER_BASIC_INFOS = gql`
  fragment CashRegisterBasicInfosFragment on CashRegisterType {
    id
    number
    name
    isActive
    description
    openingDate
    closingDate
    establishments{
      ...CashRegisterEstablishmentFragment
    }
    managers{
      ...CashRegisterManagerFragment
    }
  }
  ${CASH_REGISTER_ESTABLISHMENT_DETAILS}
  ${MANAGER_CASH_REGISTER_ITEM_DETAILS}
`;

export const CASH_REGISTER_DETAILS = gql`
  fragment CashRegisterDetailsFragment on CashRegisterType {
    ...CashRegisterBasicInfosFragment
  }
  ${CASH_REGISTER_BASIC_INFOS}
`;

export const CASH_REGISTER_RECAP_DETAILS = gql`
  fragment CashRegisterRecapDetailsFragment on CashRegisterType {
    ...CashRegisterBasicInfosFragment
    createdAt
    updatedAt
  }
  ${CASH_REGISTER_BASIC_INFOS}
`;