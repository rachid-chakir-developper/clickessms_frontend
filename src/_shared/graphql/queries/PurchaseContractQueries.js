import { gql } from '@apollo/client';
import {
  PURCHASE_CONTRACT_BASIC_INFOS,
  PURCHASE_CONTRACT_DETAILS,
  PURCHASE_CONTRACT_RECAP,
} from '../fragments/PurchaseContractFragment';

export const GET_PURCHASE_CONTRACT = gql`
  query GetPurchaseContract($id: ID!) {
    purchaseContract(id: $id) {
      ...PurchaseContractDetailsFragment
    }
  }
  ${PURCHASE_CONTRACT_DETAILS}
`;

export const GET_PURCHASE_CONTRACTS = gql`
  query GetPurchaseContracts(
    $purchaseContractFilter: PurchaseContractFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    purchaseContracts(
      purchaseContractFilter: $purchaseContractFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...PurchaseContractBasicInfosFragment
      }
    }
  }
  ${PURCHASE_CONTRACT_BASIC_INFOS}
`;

export const GET_PURCHASE_CONTRACT_RECAP = gql`
  query GetPurchaseContract($id: ID!) {
    purchaseContract(id: $id) {
      ...PurchaseContractRecapDetailsFragment
    }
  }
  ${PURCHASE_CONTRACT_RECAP}
`;

// Add mor
// Add more messageNotification-related queries here

// Add more purchaseContract-related queries here
