// PartnerFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';

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

export const PARTNER_BASIC_INFOS = gql`
  fragment PartnerBasicInfosFragment on PartnerType {
    id
    name
    email
    photo
    coverImage
    isActive
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${FOLDER_MINI_INFOS}
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
