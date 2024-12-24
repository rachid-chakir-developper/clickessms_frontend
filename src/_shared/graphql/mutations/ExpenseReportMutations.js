import { gql } from '@apollo/client';
import { EXPENSE_REPORT_BASIC_INFOS } from '../fragments/ExpenseReportFragment';
import { PURCHASE_ORDER_BASIC_INFOS } from '../fragments/PurchaseOrderFragment';

export const POST_EXPENSE_REPORT = gql`
  mutation CreateExpenseReport($expenseReportData: ExpenseReportInput!, $files : [MediaInput]) {
    createExpenseReport(expenseReportData: $expenseReportData, files: $files) {
      expenseReport {
        ...ExpenseReportBasicInfosFragment
      }
    }
  }
  ${EXPENSE_REPORT_BASIC_INFOS}
`;

export const PUT_EXPENSE_REPORT = gql`
  mutation UpdateExpenseReport(
    $id: ID!
    $expenseReportData: ExpenseReportInput!
    $files : [MediaInput]
  ) {
    updateExpenseReport(id: $id, expenseReportData: $expenseReportData, files: $files) {
      expenseReport {
        ...ExpenseReportBasicInfosFragment
      }
    }
  }
  ${EXPENSE_REPORT_BASIC_INFOS}
`;

export const PUT_EXPENSE_REPORT_STATE = gql`
  mutation UpdateExpenseReportState($id: ID!) {
    updateExpenseReportState(id: $id) {
      done
      success
      message
      expenseReport {
        ...ExpenseReportBasicInfosFragment
      }
    }
  }
  ${EXPENSE_REPORT_BASIC_INFOS}
`;

export const PUT_EXPENSE_REPORT_FIELDS = gql`
  mutation UpdateExpenseReportFields($id: ID!, $expenseReportData: ExpenseReportInput!) {
    updateExpenseReportFields(id: $id, expenseReportData: $expenseReportData) {
      done
      success
      message
      expenseReport {
        ...ExpenseReportBasicInfosFragment
      }
    }
  }
  ${EXPENSE_REPORT_BASIC_INFOS}
`;

export const GENERATE_PURCHASE_ORDER_FROM_EXPENSE_REPORT = gql`
  mutation GeneratePurchaseOrder($idExpenseReport: ID!, $idPurchaseOrder: ID) {
    generatePurchaseOrder(idExpenseReport: $idExpenseReport, idPurchaseOrder: $idPurchaseOrder) {
      success
      message
      purchaseOrder{
        ...PurchaseOrderBasicInfosFragment
      }
    }
  }
  ${PURCHASE_ORDER_BASIC_INFOS}
`;

export const DELETE_EXPENSE_REPORT = gql`
  mutation DeleteExpenseReport($id: ID!) {
    deleteExpenseReport(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
