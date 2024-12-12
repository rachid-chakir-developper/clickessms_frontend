// PartnerFragment.js

import { gql } from '@apollo/client';

export const PARTNER_PHONE_INFOS = gql`
  fragment PartnerPhoneInfosFragment on PartnerType {
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

export const PARTNER_MINI_INFOS = gql`
  fragment PartnerMiniInfosFragment on PartnerType {
    id
    name
    email
    photo
    coverImage
    isActive
  }
`;

export const PARTNER_BASIC_INFOS = gql`
  fragment PartnerBasicInfosFragment on PartnerType {
    ...PartnerMiniInfosFragment
    folder {
      id
      name
    }
  }
  ${PARTNER_MINI_INFOS}
`;

export const PARTNER_DETAILS = gql`
  fragment PartnerDetailsFragment on PartnerType {
    ...PartnerBasicInfosFragment
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
    partnerType
  }
  ${PARTNER_BASIC_INFOS}
`;
