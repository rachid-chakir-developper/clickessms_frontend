import { gql } from '@apollo/client';
import {
  SUPPLIER_BASIC_INFOS,
  SUPPLIER_DETAILS,
} from '../fragments/SupplierFragment';

export const GET_SUPPLIER = gql`
  query GetSupplier($id: ID!) {
    supplier(id: $id) {
      ...SupplierDetailsFragment
    }
  }
  ${SUPPLIER_DETAILS}
`;

export const GET_SUPPLIERS = gql`
  query GetSuppliers(
    $supplierFilter: SupplierFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    suppliers(
      supplierFilter: $supplierFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...SupplierBasicInfosFragment
      }
    }
  }
  ${SUPPLIER_BASIC_INFOS}
`;

// Add more supplier-related queries here
