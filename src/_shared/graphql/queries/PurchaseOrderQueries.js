import { gql } from '@apollo/client';
import {
  PURCHASE_ORDER_BASIC_INFOS,
  PURCHASE_ORDER_DETAILS,
  PURCHASE_ORDER_RECAP,
} from '../fragments/PurchaseOrderFragment';

export const GET_PURCHASE_ORDER = gql`
  query GetPurchaseOrder($id: ID!) {
    purchaseOrder(id: $id) {
      ...PurchaseOrderDetailsFragment
    }
  }
  ${PURCHASE_ORDER_DETAILS}
`;

export const GET_PURCHASE_ORDERS = gql`
  query GetPurchaseOrders(
    $purchaseOrderFilter: PurchaseOrderFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    purchaseOrders(
      purchaseOrderFilter: $purchaseOrderFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...PurchaseOrderBasicInfosFragment
      }
    }
  }
  ${PURCHASE_ORDER_BASIC_INFOS}
`;


export const GET_PURCHASE_ORDER_RECAP = gql`
  query GetPurchaseOrder($id: ID!) {
    purchaseOrder(id: $id) {
      ...PurchaseOrderRecapFragment
    }
  }
  ${PURCHASE_ORDER_RECAP}
`;
// Add more purchaseOrder-related queries here
// Add more purchaseOrder-related queries here


// Add more purchaseOrder-related queries here
