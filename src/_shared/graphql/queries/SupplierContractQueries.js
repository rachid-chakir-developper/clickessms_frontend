import { gql } from '@apollo/client';
import {
  SUPPLIER_CONTRACT_BASIC_INFOS,
  SUPPLIER_CONTRACT_DETAILS,
} from '../fragments/SupplierContractFragment';

export const GET_SUPPLIER_CONTRACT = gql`
  query GetSupplierContract($id: ID!) {
    supplierContract(id: $id) {
      ...SupplierContractDetailsFragment
    }
  }
  ${SUPPLIER_CONTRACT_DETAILS}
`;

export const GET_SUPPLIER_CONTRACTS = gql`
  query GetSupplierContracts(
    $supplierId: ID!
    $offset: Int
    $limit: Int
    $page: Int
    $searchTerm: String
    $filterType: String
  ) {
    supplierContracts(
      supplierId: $supplierId
      offset: $offset
      limit: $limit
      page: $page
      searchTerm: $searchTerm
      filterType: $filterType
    ) {
      totalCount
      nodes {
        ...SupplierContractBasicInfosFragment
      }
    }
  }
  ${SUPPLIER_CONTRACT_BASIC_INFOS}
`; 