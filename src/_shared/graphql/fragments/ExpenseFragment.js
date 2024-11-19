// ExpenseFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';


export const EXPENSE_ESTABLISHMENT_DETAILS = gql`
  fragment ExpenseEstablishmentTypeFragment on ExpenseEstablishmentType {
    id
    establishment{
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const EXPENSE_BASIC_INFOS = gql`
  fragment ExpenseBasicInfosFragment on ExpenseType {
    id
    label
    totalAmount
    expenseDateTime
    status
    isActive
    establishments{
      ...ExpenseEstablishmentTypeFragment
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
  ${EXPENSE_ESTABLISHMENT_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;



export const EXPENSE_ITEM_DETAILS = gql`
  fragment ExpenseItemFragment on ExpenseItemType {
    id
	  amount
    accountingNature{
      id
      name
    }
    establishment{
      ...EstablishmentMiniInfosFragment
    }
    description
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const EXPENSE_DETAILS = gql`
  fragment ExpenseDetailsFragment on ExpenseType {
    ...ExpenseBasicInfosFragment
    description
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
