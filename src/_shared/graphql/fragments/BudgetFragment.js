// BudgetFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const BUDGET_ACCOUNTING_NATURE_BASIC_INFOS = gql`
  fragment BudgetAccountingNatureBasicInfosFragment on BudgetAccountingNatureType {
    id
    amountAllocated
    budget{
      id
      name
    }
    accountingNature{
      id
      name
    }
    managers{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;


export const BUDGET_BASIC_INFOS = gql`
  fragment BudgetBasicInfosFragment on BudgetType {
    id
    number
    name
    amountAllocated
    amountSpent
    startingDate
    endingDate
    status
    isActive
    establishment {
      ...EstablishmentMiniInfosFragment
    }
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
  ${FOLDER_MINI_INFOS}
`;

export const BUDGET_DETAILS = gql`
  fragment BudgetDetailsFragment on BudgetType {
    ...BudgetBasicInfosFragment
    description
    observation
  }
  ${BUDGET_BASIC_INFOS}
`;

export const BUDGET_RECAP_DETAILS = gql`
  fragment BudgetRecapDetailsFragment on BudgetType {
    ...BudgetBasicInfosFragment
    description
    observation
  }
  ${BUDGET_BASIC_INFOS}
`;
