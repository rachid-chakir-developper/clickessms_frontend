// EstablishmentFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';

export const ESTABLISHMENT_PHONE_INFOS = gql`
  fragment EstablishmentPhoneInfosFragment on EstablishmentType {
    id
    number
    name
    mobile
    fix
    email
    logo
    isActive
  }
`;

export const ESTABLISHMENT_MINI_INFOS = gql`
  fragment EstablishmentMiniInfosFragment on EstablishmentType {
    id
    number
    name
    siret
    email
    logo
    coverImage
    isActive
  }
`;

export const ESTABLISHMENT_BASIC_INFOS = gql`
  fragment EstablishmentBasicInfosFragment on EstablishmentType {
    ...EstablishmentMiniInfosFragment
    establishmentType {
      id
      name
    }
    establishmentParent {
      ...EstablishmentMiniInfosFragment
    }
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
  ${FOLDER_MINI_INFOS}
`;
export const ESTABLISHMENT_DETAILS = gql`
  fragment EstablishmentDetailsFragment on EstablishmentType {
    ...EstablishmentBasicInfosFragment
    establishmentChilds {
      ...EstablishmentBasicInfosFragment
    }
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
    isActive
    description
    observation
  }
  ${ESTABLISHMENT_BASIC_INFOS}
`;
