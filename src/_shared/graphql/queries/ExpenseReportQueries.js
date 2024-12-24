import { gql } from '@apollo/client';
import {
  EXPENSE_REPORT_BASIC_INFOS,
  EXPENSE_REPORT_DETAILS,
  EXPENSE_REPORT_RECAP,
} from '../fragments/ExpenseReportFragment';

export const GET_EXPENSE_REPORT = gql`
  query GetExpenseReport($id: ID!) {
    expenseReport(id: $id) {
      ...ExpenseReportDetailsFragment
    }
  }
  ${EXPENSE_REPORT_DETAILS}
`;

export const GET_EXPENSE_REPORTS = gql`
  query GetExpenseReports(
    $expenseReportFilter: ExpenseReportFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    expenseReports(
      expenseReportFilter: $expenseReportFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...ExpenseReportBasicInfosFragment
      }
    }
  }
  ${EXPENSE_REPORT_BASIC_INFOS}
`;


export const GET_EXPENSE_REPORT_RECAP = gql`
  query GetExpenseReport($id: ID!) {
    expenseReport(id: $id) {
      ...ExpenseReportRecapFragment
    }
  }
  ${EXPENSE_REPORT_RECAP}
`;
// Add more expenseReport-related queries here
// Add more expenseReport-related queries here


// Add more expenseReport-related queries here
