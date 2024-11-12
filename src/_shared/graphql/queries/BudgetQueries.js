import { gql } from '@apollo/client';
import {
  BUDGET_BASIC_INFOS,
  BUDGET_DETAILS,
  BUDGET_RECAP_DETAILS,
} from '../fragments/BudgetFragment';

export const GET_BUDGET = gql`
  query GetBudget($id: ID!) {
    budget(id: $id) {
      ...BudgetDetailsFragment
    }
  }
  ${BUDGET_DETAILS}
`;

export const GET_BUDGETS = gql`
  query GetBudgets(
    $budgetFilter: BudgetFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    budgets(
      budgetFilter: $budgetFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...BudgetBasicInfosFragment
      }
    }
  }
  ${BUDGET_BASIC_INFOS}
`;


export const BUDGET_RECAP = gql`
  query GetBudget($id: ID!) {
    budget(id: $id) {
      ...BudgetRecapDetailsFragment
    }
  }
  ${BUDGET_RECAP_DETAILS}
`;
// Add mor
// Add more budget-related queries here
