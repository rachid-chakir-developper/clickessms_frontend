// GovernanceMemberFragment.js

import { gql } from '@apollo/client';

export const GOVERNANCE_MEMBER_PHONE_INFOS = gql`
  fragment GovernanceMemberPhoneInfosFragment on GovernanceMemberType {
    id
    firstName
    lastName
    position
    email
    mobile
    fix
    photo
    coverImage
    role
    isActive
  }
`;

export const GOVERNANCE_MEMBER_ROLE_DETAILS = gql`
  fragment GovernanceMemberRoleFragment on GovernanceMemberRoleType {
    id
    role
    otherRole
    startingDateTime
    endingDateTime
  }
`;

export const GOVERNANCE_MEMBER_MINI_INFOS = gql`
  fragment GovernanceMemberMiniInfosFragment on GovernanceMemberType {
    id
    firstName
    lastName
    position
    email
    photo
    coverImage
    governanceRoles
    role
    isActive
    isArchived
  }
`;

export const GOVERNANCE_MEMBER_BASIC_INFOS = gql`
  fragment GovernanceMemberBasicInfosFragment on GovernanceMemberType {
    ...GovernanceMemberMiniInfosFragment
    governanceMemberRoles{
      ...GovernanceMemberRoleFragment
    }
    lastGovernanceMemberRole{
      ...GovernanceMemberRoleFragment
      isActive
    }
    folder {
      id
      number
      name
    }
  }
  ${GOVERNANCE_MEMBER_MINI_INFOS}
  ${GOVERNANCE_MEMBER_ROLE_DETAILS}
`;

export const GOVERNANCE_MEMBER_DETAILS = gql`
  fragment GovernanceMemberDetailsFragment on GovernanceMemberType {
    ...GovernanceMemberBasicInfosFragment
    hiringDate
    probationEndDate
    workEndDate
    startingSalary
    description
    latitude
    longitude
    country
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
    observation
  }
  ${GOVERNANCE_MEMBER_BASIC_INFOS}
`;
