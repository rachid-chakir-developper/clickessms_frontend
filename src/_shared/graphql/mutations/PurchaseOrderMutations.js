import { gql } from '@apollo/client';
import { PURCHASE_ORDER_BASIC_INFOS } from '../fragments/PurchaseOrderFragment';

export const POST_PURCHASE_ORDER = gql`
  mutation CreatePurchaseOrder($purchaseOrderData: PurchaseOrderInput!) {
    createPurchaseOrder(purchaseOrderData: $purchaseOrderData) {
      purchaseOrder {
        ...PurchaseOrderBasicInfosFragment
      }
    }
  }
  ${PURCHASE_ORDER_BASIC_INFOS}
`;

export const PUT_PURCHASE_ORDER = gql`
  mutation UpdatePurchaseOrder(
    $id: ID!
    $purchaseOrderData: PurchaseOrderInput!
  ) {
    updatePurchaseOrder(id: $id, purchaseOrderData: $purchaseOrderData) {
      purchaseOrder {
        ...PurchaseOrderBasicInfosFragment
      }
    }
  }
  ${PURCHASE_ORDER_BASIC_INFOS}
`;

export const PUT_PURCHASE_ORDER_STATE = gql`
  mutation UpdatePurchaseOrderState($id: ID!) {
    updatePurchaseOrderState(id: $id) {
      done
      success
      message
      purchaseOrder {
        ...PurchaseOrderBasicInfosFragment
      }
    }
  }
  ${PURCHASE_ORDER_BASIC_INFOS}
`;

export const PUT_PURCHASE_ORDER_FIELDS = gql`
  mutation UpdatePurchaseOrderFields($id: ID!, $purchaseOrderData: PurchaseOrderInput!) {
    updatePurchaseOrderFields(id: $id, purchaseOrderData: $purchaseOrderData) {
      done
      success
      message
      purchaseOrder {
        ...PurchaseOrderBasicInfosFragment
      }
    }
  }
  ${PURCHASE_ORDER_BASIC_INFOS}
`;

export const DELETE_PURCHASE_ORDER = gql`
  mutation DeletePurchaseOrder($id: ID!) {
    deletePurchaseOrder(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
