// SupplierFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';

export const SUPPLIER_BASIC_INFOS = gql`
  fragment SupplierBasicInfosFragment on SupplierType {
    id
    number
    externalNumber
    name
    email
    photo
    coverImage
    isActive
    folder{
      ...FolderMiniInfosFragment
    }
  }
  ${FOLDER_MINI_INFOS}
`
export const SUPPLIER_DETAILS = gql`
  fragment SupplierDetailsFragment on SupplierType {
    ...SupplierBasicInfosFragment
    managerName
    latitude
    longitude
    city
    zipCode
    address
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