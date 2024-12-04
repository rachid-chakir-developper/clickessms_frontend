// ExpenseFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';
import { SUPPLIER_MINI_INFOS } from './SupplierFragment';

export const EXPENSE_BASIC_INFOS = gql`
  fragment ExpenseBasicInfosFragment on ExpenseType {
    id
    label
    totalAmount
    expenseDateTime
    paymentMethod
    expenseType
    status
    isAmountAccurate
    isPlannedInBudget
    isActive
    establishment{
      ...EstablishmentMiniInfosFragment
    }
    employee {
      ...EmployeeBasicInfosFragment
    }
    supplier {
      ...SupplierMiniInfosFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
  ${EMPLOYEE_BASIC_INFOS}
  ${SUPPLIER_MINI_INFOS}
`;



export const EXPENSE_ITEM_DETAILS = gql`
  fragment ExpenseItemFragment on ExpenseItemType {
    id
	  amount
    quantity
    accountingNature{
      id
      name
    }
    comment
    description
  }
`;

export const EXPENSE_DETAILS = gql`
  fragment ExpenseDetailsFragment on ExpenseType {
    ...ExpenseBasicInfosFragment
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
    expenseItems{
      ...ExpenseItemFragment
    }
  }
  ${EXPENSE_BASIC_INFOS}
  ${EXPENSE_ITEM_DETAILS}
`;

export const EXPENSE_RECAP = gql`
  fragment ExpenseRecapFragment on ExpenseType {
    ...ExpenseBasicInfosFragment
    description
    comment
    observation
    expenseItems{
      ...ExpenseItemFragment
    }
    createdAt
    updatedAt 
  }
  ${EXPENSE_BASIC_INFOS}
  ${EXPENSE_ITEM_DETAILS}
`;
