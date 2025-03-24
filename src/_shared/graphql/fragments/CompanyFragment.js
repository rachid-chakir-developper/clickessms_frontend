// CompanyFragment.js

import { gql } from '@apollo/client';

export const COMPANY_MEDIA_INFOS = gql`
  fragment CompanyMediaBasicInfosFragment on CompanyMediaType {
    id
    collectiveAgreement
    collectiveAgreementUrl
    companyAgreement
    companyAgreementUrl
    laborLaw
    laborLawUrl
    associationsFoundationsCode
    associationsFoundationsCodeUrl
    safcCode
    safcCodeUrl
    sceShopUrl
    blogUrl
  }
`;

export const COMPANY_BASIC_INFOS = gql`
  fragment CompanyBasicInfosFragment on CompanyType {
    id
    name
    email
    logo
    coverImage
    companyMedia{
      ...CompanyMediaBasicInfosFragment
    }
    isActive
    status
  }
  ${COMPANY_MEDIA_INFOS}
`;

export const MY_COMPANY_DETAILS = gql`
  fragment MyCompanyDetailsFragment on CompanyType {
    ...CompanyBasicInfosFragment
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
  }
  ${COMPANY_BASIC_INFOS}
`;

export const COMPANY_ADMIN_DETAILS = gql`
  fragment CompanyAdminDetails on UserType {
    id
    firstName
    lastName
    email
  }
`;

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
    companyAdmin{
      ...CompanyAdminDetails
    }
  }
  ${COMPANY_BASIC_INFOS}
  ${COMPANY_ADMIN_DETAILS}
`;

