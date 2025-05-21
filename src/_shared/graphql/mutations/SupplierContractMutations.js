import { gql } from '@apollo/client';
import { SUPPLIER_CONTRACT_BASIC_INFOS } from '../fragments/SupplierContractFragment';

export const CREATE_SUPPLIER_CONTRACT = gql`
  mutation CreateSupplierContract(
    $supplierId: ID!
    $contractData: SupplierContractInput!
  ) {
    createSupplierContract(
      supplierId: $supplierId
      contractData: $contractData
    ) {
      supplierContract {
        ...SupplierContractBasicInfosFragment
      }
    }
  }
  ${SUPPLIER_CONTRACT_BASIC_INFOS}
`;

export const UPDATE_SUPPLIER_CONTRACT = gql`
  mutation UpdateSupplierContract(
    $id: ID!
    $contractData: SupplierContractInput!
  ) {
    updateSupplierContract(
      id: $id
      contractData: $contractData
    ) {
      supplierContract {
        ...SupplierContractBasicInfosFragment
      }
    }
  }
  ${SUPPLIER_CONTRACT_BASIC_INFOS}
`;

export const DELETE_SUPPLIER_CONTRACT = gql`
  mutation DeleteSupplierContract($id: ID!) {
    deleteSupplierContract(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;

export const UPLOAD_SUPPLIER_CONTRACT_DOCUMENT = gql`
  mutation UploadSupplierContractDocument(
    $contractId: ID!
    $file: Upload!
  ) {
    uploadSupplierContractDocument(
      contractId: $contractId
      file: $file
    ) {
      documentUrl
      success
      message
    }
  }
`;

export const DELETE_SUPPLIER_CONTRACT_DOCUMENT = gql`
  mutation DeleteSupplierContractDocument(
    $contractId: ID!
    $documentUrl: String!
  ) {
    deleteSupplierContractDocument(
      contractId: $contractId
      documentUrl: $documentUrl
    ) {
      success
      deleted
      message
    }
  }
`; 