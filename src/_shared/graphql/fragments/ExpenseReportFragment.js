// ExpenseReportFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';

export const EXPENSE_REPORT_BASIC_INFOS = gql`
  fragment ExpenseReportBasicInfosFragment on ExpenseReportType {
    id
    number
    label
    totalAmount
    expenseDateTime
    paymentMethod
    status
    establishment{
      ...EstablishmentMiniInfosFragment
    }
    employee {
      ...EmployeeBasicInfosFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
  ${EMPLOYEE_BASIC_INFOS}
`;



export const EXPENSE_REPORT_DETAILS = gql`
  fragment ExpenseReportDetailsFragment on ExpenseReportType {
    ...ExpenseReportBasicInfosFragment
    description
    comment
    observation
    files {
      id
      caption
      file
      createdAt
      updatedAt
    }
  }
  ${EXPENSE_REPORT_BASIC_INFOS}
`;

export const EXPENSE_REPORT_RECAP = gql`
  fragment ExpenseReportRecapFragment on ExpenseReportType {
    ...ExpenseReportBasicInfosFragment
    description
    comment
    observation
    createdAt
    updatedAt 
  }
  ${EXPENSE_REPORT_BASIC_INFOS}
`;
