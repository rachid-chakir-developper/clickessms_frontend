// BeneficiaryExpenseFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const BENEFICIARY_EXPENSE_BASIC_INFOS = gql`
  fragment BeneficiaryExpenseBasicInfosFragment on BeneficiaryExpenseType {
    number
    label
    endowmentType{
      id
      name
    }
	  amount
    expenseDateTime
    paymentMethod
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
  }
  ${EMPLOYEE_MINI_INFOS}
  ${BENEFICIARY_MINI_INFOS}
`;

export const BENEFICIARY_EXPENSE_DETAILS = gql`
  fragment BeneficiaryExpenseDetailsFragment on BeneficiaryExpenseType {
    ...BeneficiaryExpenseBasicInfosFragment
  }
  ${BENEFICIARY_EXPENSE_BASIC_INFOS}
`;


export const BENEFICIARY_EXPENSE_RECAP_DETAILS = gql`
  fragment BeneficiaryExpenseRecapDetailsFragment on BeneficiaryExpenseType {
    ...BeneficiaryExpenseBasicInfosFragment
    createdAt,
    updatedAt,
  }
  ${BENEFICIARY_EXPENSE_BASIC_INFOS}
`;
