// EmployeeContractFragment.js

import { gql } from '@apollo/client';

export const EMPLOYEE_CONTRACT_ESTABLISHMENT_DETAILS = gql`
  fragment EmployeeContractEstablishmentTypeFragment on EmployeeContractEstablishmentType {
    id
    establishment{
      id
      number
      name
      email
      logo
      coverImage
      isActive
    }
  }
`;

export const EMPLOYEE_CONTRACT_MINI_INFOS = gql`
  fragment EmployeeContractMiniInfosFragment on EmployeeContractType {
    id
    number
    title
    document
    position
    monthlyGrossSalary
    salary
    startingDate
    endingDate
    description
    isActive
    restLeaveDays
    contractType
    establishments{
      ...EmployeeContractEstablishmentTypeFragment
    }
  }
  ${EMPLOYEE_CONTRACT_ESTABLISHMENT_DETAILS}
`;

export const EMPLOYEE_CONTRACT_BASIC_INFOS = gql`
  fragment EmployeeContractBasicInfosFragment on EmployeeContractType {
    ...EmployeeContractMiniInfosFragment
    employee{
      id
      firstName
      lastName
    }
  }
  ${EMPLOYEE_CONTRACT_MINI_INFOS}
`;

export const EMPLOYEE_CONTRACT_DETAILS = gql`
  fragment EmployeeContractDetailsFragment on EmployeeContractType {
    ...EmployeeContractBasicInfosFragment
    initialAnnualLeaveDays
    initialRttDays
    initialCtDays
    observation
    startedAt
    endedAt
  }
  ${EMPLOYEE_CONTRACT_BASIC_INFOS}
`;

export const EMPLOYEE_CONTRACT_RECAP_DETAILS = gql`
  fragment EmployeeContractRecapDetailsFragment on EmployeeContractType {
    ...EmployeeContractBasicInfosFragment
    initialAnnualLeaveDays
    initialRttDays
    initialCtDays
    observation
    startedAt
    endedAt
  }
  ${EMPLOYEE_CONTRACT_BASIC_INFOS}
`;
