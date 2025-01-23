// BeneficiaryExpenseFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { BANK_CARD_MINI_INFOS } from './BankCardFragment';
import { CASH_REGISTER_MINI_INFOS } from './CashRegisterFragment';

export const BENEFICIARY_EXPENSE_BASIC_INFOS = gql`
  fragment BeneficiaryExpenseBasicInfosFragment on BeneficiaryExpenseType {
    id
    number
    label
    endowmentType{
      id
      name
    }
	  amount
    expenseDateTime
    paymentMethod
    checkNumber
    bankName
    status
    description
    comment
    observation
    employee{
        ...EmployeeMiniInfosFragment
    }
    beneficiary{
        ...BeneficiaryMiniInfosFragment
    }
    bankCard{
      ...BankCardMiniInfosFragment
    }
    cashRegister{
      ...CashRegisterMiniInfosFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${EMPLOYEE_MINI_INFOS}
  ${BENEFICIARY_MINI_INFOS}
  ${BANK_CARD_MINI_INFOS}
  ${CASH_REGISTER_MINI_INFOS}
`;

export const BENEFICIARY_EXPENSE_DETAILS = gql`
  fragment BeneficiaryExpenseDetailsFragment on BeneficiaryExpenseType {
    ...BeneficiaryExpenseBasicInfosFragment
    files {
      id
      caption
      file
      createdAt
      updatedAt
    }
  }
  ${BENEFICIARY_EXPENSE_BASIC_INFOS}
`;


export const BENEFICIARY_EXPENSE_RECAP_DETAILS = gql`
  fragment BeneficiaryExpenseRecapDetailsFragment on BeneficiaryExpenseType {
    ...BeneficiaryExpenseBasicInfosFragment
    files {
      id
      caption
      file
      createdAt
      updatedAt
    }
    createdAt,
    updatedAt,
  }
  ${BENEFICIARY_EXPENSE_BASIC_INFOS}
`;
