// BudgetFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';

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