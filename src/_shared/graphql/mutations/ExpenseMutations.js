import { gql } from '@apollo/client';
import { EXPENSE_BASIC_INFOS } from '../fragments/ExpenseFragment';
import { PURCHASE_ORDER_BASIC_INFOS } from '../fragments/PurchaseOrderFragment';

export const POST_EXPENSE = gql`
  mutation CreateExpense($expenseData: ExpenseInput!, $files : [MediaInput]) {
    createExpense(expenseData: $expenseData, files: $files) {
      expense {
        ...ExpenseBasicInfosFragment
      }
    }
  }
  ${EXPENSE_BASIC_INFOS}
`;

export const PUT_EXPENSE = gql`
  mutation UpdateExpense(
    $id: ID!
    $expenseData: ExpenseInput!
    $files : [MediaInput]
  ) {
    updateExpense(id: $id, expenseData: $expenseData, files: $files) {
      expense {
        ...ExpenseBasicInfosFragment
      }
    }
  }
  ${EXPENSE_BASIC_INFOS}
`;

export const PUT_EXPENSE_STATE = gql`
  mutation UpdateExpenseState($id: ID!) {
    updateExpenseState(id: $id) {
      done
      success
      message
      expense {
        ...ExpenseBasicInfosFragment
      }
    }
  }
  ${EXPENSE_BASIC_INFOS}
`;

export const PUT_EXPENSE_FIELDS = gql`
  mutation UpdateExpenseFields($id: ID!, $expenseData: ExpenseInput!) {
    updateExpenseFields(id: $id, expenseData: $expenseData) {
      done
      success
      message
      expense {
        ...ExpenseBasicInfosFragment
      }
    }
  }
  ${EXPENSE_BASIC_INFOS}
`;

export const GENERATE_PURCHASE_ORDER_FROM_EXPENSE = gql`
  mutation GeneratePurchaseOrder($idExpense: ID!, $idPurchaseOrder: ID) {
    generatePurchaseOrder(idExpense: $idExpense, idPurchaseOrder: $idPurchaseOrder) {
      success
      message
      purchaseOrder{
        ...PurchaseOrderBasicInfosFragment
      }
    }
  }
  ${PURCHASE_ORDER_BASIC_INFOS}
`;

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
