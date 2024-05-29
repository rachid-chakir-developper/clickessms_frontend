// EmployeeFragment.js

import { gql } from '@apollo/client';

export const EMPLOYEE_PHONE_INFOS = gql`
  fragment EmployeePhoneInfosFragment on EmployeeType {
    id
    firstName
    lastName
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
    firstName
    lastName
    position
    email
    photo
    coverImage
    isActive
  }
`;

export const EMPLOYEE_BASIC_INFOS = gql`
  fragment EmployeeBasicInfosFragment on EmployeeType {
    ...EmployeeMiniInfosFragment
    birthDate
    folder {
      id
      number
      name
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const EMPLOYEE_DETAILS = gql`
  fragment EmployeeDetailsFragment on EmployeeType {
    ...EmployeeBasicInfosFragment
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
