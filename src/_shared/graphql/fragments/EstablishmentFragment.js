// EstablishmentFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';

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
    finess
    apeCode
    email
    logo
    coverImage
    isActive
  }
`;

export const ESTABLISHMENT_BASIC_INFOS = gql`
  fragment EstablishmentBasicInfosFragment on EstablishmentType {
    ...EstablishmentMiniInfosFragment
    establishmentCategory {
      id
      name
    }
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

export const ESTABLISHMENT_MANAGER_DETAILS = gql`
  fragment EstablishmentManagerTypeFragment on EstablishmentManagerType {
    id
    employee {
      ...EmployeeBasicInfosFragment
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const ACTIVITY_AUTHORIZATION_DETAILS = gql`
  fragment ActivityAuthorizationFragment on ActivityAuthorizationType {
    id
    startingDateTime
    endingDateTime
    capacity
  }
`;

export const ESTABLISHMENT_DETAILS = gql`
  fragment EstablishmentDetailsFragment on EstablishmentType {
    ...EstablishmentBasicInfosFragment
    establishmentChilds {
      ...EstablishmentBasicInfosFragment
    }
    openingDate
    measurementActivityUnit
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
    managers{
      ...EstablishmentManagerTypeFragment
    }
    activityAuthorizations{
      ...ActivityAuthorizationFragment
    }
  }
  ${ESTABLISHMENT_BASIC_INFOS}
  ${ESTABLISHMENT_MANAGER_DETAILS}
  ${ACTIVITY_AUTHORIZATION_DETAILS}
`;
