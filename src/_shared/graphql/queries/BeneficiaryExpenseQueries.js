import { gql } from '@apollo/client';
import {
  BENEFICIARY_EXPENSE_BASIC_INFOS,
  BENEFICIARY_EXPENSE_DETAILS,
  BENEFICIARY_EXPENSE_RECAP_DETAILS,
} from '../fragments/BeneficiaryExpenseFragment';

export const GET_BENEFICIARY_EXPENSE = gql`
  query GetBeneficiaryExpense($id: ID!) {
    beneficiaryExpense(id: $id) {
      ...BeneficiaryExpenseDetailsFragment
    }
  }
  ${BENEFICIARY_EXPENSE_DETAILS}
`;

export const GET_BENEFICIARY_EXPENSES = gql`
  query GetBeneficiaryExpenses(
    $beneficiaryExpenseFilter: BeneficiaryExpenseFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    beneficiaryExpenses(
      beneficiaryExpenseFilter: $beneficiaryExpenseFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...BeneficiaryExpenseBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_EXPENSE_BASIC_INFOS}
`;

export const GET_RECAP_BENEFICIARY_EXPENSE = gql`
  query GetBeneficiaryExpense($id: ID!) {
    beneficiaryExpense(id: $id) {
      ...BeneficiaryExpenseRecapDetailsFragment
    }
  }
  ${BENEFICIARY_EXPENSE_RECAP_DETAILS}
`;