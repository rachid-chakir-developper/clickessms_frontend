// EmployeeFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_CONTRACT_MINI_INFOS } from './EmployeeContractFragment';

export const EMPLOYEE_PHONE_INFOS = gql`
  fragment EmployeePhoneInfosFragment on EmployeeType {
    id
    registrationNumber
    firstName
    lastName
    preferredName
    position
    email
    mobile
    fix
    photo
    coverImage
    isActive
  }
`;

export const EMPLOYEE_MINI_INFOS = gql`
  fragment EmployeeMiniInfosFragment on EmployeeType {
    id
    registrationNumber
    firstName
    lastName
    preferredName
    position
    sceRoles
    email
    photo
    coverImage
    isActive
  }
`;

export const EMPLOYEE_BASIC_INFOS = gql`
  fragment EmployeeBasicInfosFragment on EmployeeType {
    ...EmployeeMiniInfosFragment
    socialSecurityNumber
    birthDate
    currentContract{
      ...EmployeeContractMiniInfosFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${EMPLOYEE_MINI_INFOS}
  ${EMPLOYEE_CONTRACT_MINI_INFOS}
`;

export const EMPLOYEE_DETAILS = gql`
  fragment EmployeeDetailsFragment on EmployeeType {
    ...EmployeeBasicInfosFragment
    birthPlace
    nationality
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
  ${EMPLOYEE_BASIC_INFOS}
`;

export const EMPLOYEE_RECAP_DETAILS = gql`
  fragment EmployeeRecapDetailsFragment on EmployeeType {
    ...EmployeeBasicInfosFragment
    birthPlace
    nationality
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
    createdAt
    updatedAt
  }
  ${EMPLOYEE_BASIC_INFOS}
`;
