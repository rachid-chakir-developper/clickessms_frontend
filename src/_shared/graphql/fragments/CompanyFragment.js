// CompanyFragment.js

import { gql } from '@apollo/client';

export const COMPANY_BASIC_INFOS = gql`
  fragment CompanyBasicInfosFragment on CompanyType {
    id
    name
    email
    logo
    coverImage
    isActive
  }
`

export const COMPANY_DETAILS = gql`
  fragment CompanyDetailsFragment on CompanyType {
    ...CompanyBasicInfosFragment
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
  }
  ${COMPANY_BASIC_INFOS}
`;