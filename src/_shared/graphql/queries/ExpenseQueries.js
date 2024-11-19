import { gql } from '@apollo/client';
import {
  EXPENSE_BASIC_INFOS,
  EXPENSE_DETAILS,
  EXPENSE_RECAP,
} from '../fragments/ExpenseFragment';

export const GET_EXPENSE = gql`
  query GetExpense($id: ID!) {
    expense(id: $id) {
      ...ExpenseDetailsFragment
    }
  }
  ${EXPENSE_DETAILS}
`;

export const GET_EXPENSES = gql`
  query GetExpenses(
    $expenseFilter: ExpenseFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    expenses(
      expenseFilter: $expenseFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...ExpenseBasicInfosFragment
      }
    }
  }
  ${EXPENSE_BASIC_INFOS}
`;


export const GET_EXPENSE_RECAP = gql`
  query GetExpense($id: ID!) {
    expense(id: $id) {
      ...ExpenseRecapFragment
    }
  }
  ${EXPENSE_RECAP}
`;
// Add more expense-related queries here
// Add more expense-related queries here


// Add more expense-related queries here
