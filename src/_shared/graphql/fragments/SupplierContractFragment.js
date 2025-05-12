import { gql } from '@apollo/client';

export const SUPPLIER_CONTRACT_MINI_INFOS = gql`
  fragment SupplierContractMiniInfosFragment on SupplierContractType {
    id
    contractType
    contractNumber
    title
    startDate
    endDate
    duration
    renewalType
    renewalDate
    noticePeriod
    value
    description
  }
`;

export const SUPPLIER_CONTRACT_BASIC_INFOS = gql`
  fragment SupplierContractBasicInfosFragment on SupplierContractType {
    ...SupplierContractMiniInfosFragment
    documentUrls
    createdAt
    updatedAt
  }
  ${SUPPLIER_CONTRACT_MINI_INFOS}
`;

export const SUPPLIER_CONTRACT_DETAILS = gql`
  fragment SupplierContractDetailsFragment on SupplierContractType {
    ...SupplierContractBasicInfosFragment
    supplier {
      id
      name
    }
  }
  ${SUPPLIER_CONTRACT_BASIC_INFOS}
`; 