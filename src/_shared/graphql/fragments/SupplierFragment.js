// SupplierFragment.js

import { gql } from '@apollo/client';

export const SUPPLIER_PHONE_INFOS = gql`
  fragment SupplierPhoneInfosFragment on SupplierType {
    id
    number
    name
    mobile
    fix
    email
    photo
    isActive
  }
`;

export const SUPPLIER_MINI_INFOS = gql`
  fragment SupplierMiniInfosFragment on SupplierType {
    id
    number
    externalNumber
    name
    email
    photo
    coverImage
    isActive
  }
`;

export const SUPPLIER_BASIC_INFOS = gql`
  fragment SupplierBasicInfosFragment on SupplierType {
    ...SupplierMiniInfosFragment
    folder {
      id
      name
    }
  }
  ${SUPPLIER_MINI_INFOS}
`;
export const SUPPLIER_DETAILS = gql`
  fragment SupplierDetailsFragment on SupplierType {
    ...SupplierBasicInfosFragment
    managerName
    latitude
    longitude
    city
    zipCode
    address
    additionalAddress
    mobile
    fix
    fax
    webSite
    otherContacts
    iban
    bic
    bankName
    isActive
    description
    observation
    supplierType
  }
  ${SUPPLIER_BASIC_INFOS}
`;
