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

export const ESTABLISHMENT_MANAGER_DETAILS = gql`
  fragment EstablishmentManagerTypeFragment on EstablishmentManagerType {
    id
    employee {
      ...EmployeeBasicInfosFragment
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const ESTABLISHMENT_BASIC_INFOS = gql`
  fragment EstablishmentBasicInfosFragment on EstablishmentType {
    ...EstablishmentMiniInfosFragment
    openingDate
    establishmentCategory {
      id
      name
    }
    establishmentType {
      id
      name
    }
    managers{
      ...EstablishmentManagerTypeFragment
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
  ${ESTABLISHMENT_MANAGER_DETAILS}
`;

export const ACTIVITY_AUTHORIZATION_DETAILS = gql`
  fragment ActivityAuthorizationFragment on ActivityAuthorizationType {
    id
    document
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
    activityAuthorizations{
      ...ActivityAuthorizationFragment
    }
  }
  ${ESTABLISHMENT_BASIC_INFOS}
  ${ACTIVITY_AUTHORIZATION_DETAILS}
`;

export const ESTABLISHMENT_RECAP_DETAILS = gql`
  fragment EstablishmentReacpDetailsFragment on EstablishmentType {
    ...EstablishmentBasicInfosFragment
    establishmentChilds {
      ...EstablishmentBasicInfosFragment
    }
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
    activityAuthorizations{
      ...ActivityAuthorizationFragment
    }
    createdAt
    updatedAt
  }
  ${ESTABLISHMENT_BASIC_INFOS}
  ${ACTIVITY_AUTHORIZATION_DETAILS}
`;

