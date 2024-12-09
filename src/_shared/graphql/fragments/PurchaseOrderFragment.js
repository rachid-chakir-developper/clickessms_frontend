// PurchaseOrderFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';
import { SUPPLIER_MINI_INFOS } from './SupplierFragment';

export const PURCHASE_ORDER_BASIC_INFOS = gql`
  fragment PurchaseOrderBasicInfosFragment on PurchaseOrderType {
    id
    label
    totalAmount
    orderDateTime
    paymentMethod
    status
    establishment{
      ...EstablishmentMiniInfosFragment
    }
    employee{
      ...EmployeeBasicInfosFragment
    }
    supplier{
      ...SupplierMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
  ${EMPLOYEE_BASIC_INFOS}
  ${SUPPLIER_MINI_INFOS}
`;



export const PURCHASE_ORDER_ITEM_DETAILS = gql`
  fragment PurchaseOrderItemFragment on PurchaseOrderItemType {
    id
	amount
    quantity
    description
  }
`;

export const PURCHASE_ORDER_DETAILS = gql`
  fragment PurchaseOrderDetailsFragment on PurchaseOrderType {
    ...PurchaseOrderBasicInfosFragment
    description
    comment
    purchaseOrderItems{
      ...PurchaseOrderItemFragment
    }
  }
  ${PURCHASE_ORDER_BASIC_INFOS}
  ${PURCHASE_ORDER_ITEM_DETAILS}
`;

export const PURCHASE_ORDER_RECAP = gql`
  fragment PurchaseOrderRecapFragment on PurchaseOrderType {
    ...PurchaseOrderBasicInfosFragment
    description
    comment
    purchaseOrderItems{
      ...PurchaseOrderItemFragment
    }
    createdAt
    updatedAt 
  }
  ${PURCHASE_ORDER_BASIC_INFOS}
  ${PURCHASE_ORDER_ITEM_DETAILS}
`;
