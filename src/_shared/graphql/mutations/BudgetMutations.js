import { gql } from '@apollo/client';
import { BUDGET_ACCOUNTING_NATURE_BASIC_INFOS, BUDGET_BASIC_INFOS } from '../fragments/BudgetFragment';

export const POST_BUDGET = gql`
  mutation CreateBudget($budgetData: BudgetInput!) {
    createBudget(budgetData: $budgetData) {
      budget {
        ...BudgetBasicInfosFragment
      }
    }
  }
  ${BUDGET_BASIC_INFOS}
`;

export const PUT_BUDGET = gql`
  mutation UpdateBudget(
    $id: ID!
    $budgetData: BudgetInput!
  ) {
    updateBudget(id: $id, budgetData: $budgetData) {
      budget {
        ...BudgetBasicInfosFragment
      }
    }
  }
  ${BUDGET_BASIC_INFOS}
`;

export const PUT_ACCOUNTING_NATURE_BUDGET = gql`
  mutation UpdateBudgetAccountingNature(
    $id: ID
    $budgetAccountingNatureData: BudgetAccountingNatureInput!
  ) {
    updateBudgetAccountingNature(id: $id, budgetAccountingNatureData: $budgetAccountingNatureData) {
      budgetAccountingNature {
        ...BudgetAccountingNatureBasicInfosFragment
      }
    }
  }
  ${BUDGET_ACCOUNTING_NATURE_BASIC_INFOS}
`;

export const PUT_BUDGET_STATE = gql`
  mutation UpdateBudgetState($id: ID!) {
    updateBudgetState(id: $id) {
      done
      success
      message
      budget {
        ...BudgetBasicInfosFragment
      }
    }
  }
  ${BUDGET_BASIC_INFOS}
`;

export const PUT_BUDGET_FIELDS = gql`
  mutation UpdateBudgetFields($id: ID!, $budgetData: BudgetInput!) {
    updateBudgetFields(id: $id, budgetData: $budgetData) {
      done
      success
      message
      budget {
        ...BudgetBasicInfosFragment
      }
    }
  }
  ${BUDGET_BASIC_INFOS}
`;

export const DELETE_BUDGET = gql`
  mutation DeleteBudget($id: ID!) {
    deleteBudget(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
