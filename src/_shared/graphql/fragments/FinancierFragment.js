// FinancierFragment.js

import { gql } from '@apollo/client';

export const FINANCIER_PHONE_INFOS = gql`
  fragment FinancierPhoneInfosFragment on FinancierType {
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

export const FINANCIER_MINI_INFOS = gql`
  fragment FinancierMiniInfosFragment on FinancierType {
    id
    name
    email
    photo
    coverImage
    city
    zipCode
    address
    isActive
  }
`;

export const FINANCIER_BASIC_INFOS = gql`
  fragment FinancierBasicInfosFragment on FinancierType {
    ...FinancierMiniInfosFragment
    folder {
      id
      name
    }
  }
  ${FINANCIER_MINI_INFOS}
`;

export const FINANCIER_DETAILS = gql`
  fragment FinancierDetailsFragment on FinancierType {
    ...FinancierBasicInfosFragment
    managerName
    latitude
    longitude
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
    financierType
  }
  ${FINANCIER_BASIC_INFOS}
`;
