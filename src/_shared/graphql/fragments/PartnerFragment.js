// PartnerFragment.js

import { gql } from '@apollo/client';
// Nous allons éviter d'importer ESTABLISHMENT_MINI_INFOS pour éviter les références circulaires

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

export const PARTNER_ESTABLISHMENT_DETAILS = gql`
  fragment PartnerEstablishmentTypeFragment on PartnerEstablishmentType {
    id
    establishment {
      id
      name
      email
      logo
      isActive
    }
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
    establishments {
      ...PartnerEstablishmentTypeFragment
    }
  }
  ${PARTNER_BASIC_INFOS}
  ${PARTNER_ESTABLISHMENT_DETAILS}
`;
