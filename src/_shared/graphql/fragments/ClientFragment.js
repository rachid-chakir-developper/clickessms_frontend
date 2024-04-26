// ClientFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';

export const CLIENT_PHONE_INFOS = gql`
  fragment ClientPhoneInfosFragment on ClientType {
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

export const CLIENT_BASIC_INFOS = gql`
  fragment ClientBasicInfosFragment on ClientType {
    id
    number
    externalNumber
    name
    email
    photo
    coverImage
    address
    mobile
    isActive
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${FOLDER_MINI_INFOS}
`;
export const CLIENT_DETAILS = gql`
  fragment ClientDetailsFragment on ClientType {
    ...ClientBasicInfosFragment
    managerName
    country
    city
    zipCode
    latitude
    longitude
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
    clientType
  }
  ${CLIENT_BASIC_INFOS}
`;
