import { gql } from '@apollo/client';
import { SUPPLIER_BASIC_INFOS } from '../fragments/SupplierFragment';

export const POST_SUPPLIER = gql`
  mutation CreateSupplier(
    $supplierData: SupplierInput!
    $photo: Upload
    $coverImage: Upload
  ) {
    createSupplier(
      supplierData: $supplierData
      photo: $photo
      coverImage: $coverImage
    ) {
      supplier {
        ...SupplierBasicInfosFragment
      }
    }
  }
  ${SUPPLIER_BASIC_INFOS}
`;

export const PUT_SUPPLIER = gql`
  mutation UpdateSupplier(
    $id: ID!
    $supplierData: SupplierInput!
    $photo: Upload
    $coverImage: Upload
  ) {
    updateSupplier(
      id: $id
      supplierData: $supplierData
      photo: $photo
      coverImage: $coverImage
    ) {
      supplier {
        ...SupplierBasicInfosFragment
      }
    }
  }
  ${SUPPLIER_BASIC_INFOS}
`;

export const PUT_SUPPLIER_STATE = gql`
  mutation UpdateSupplierState($id: ID!) {
    updateSupplierState(id: $id) {
      done
      success
      message
      supplier {
        ...SupplierBasicInfosFragment
      }
    }
  }
  ${SUPPLIER_BASIC_INFOS}
`;

export const DELETE_SUPPLIER = gql`
  mutation DeleteSupplier($id: ID!) {
    deleteSupplier(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
