// EmployeeContractFragment.js

import { gql } from '@apollo/client';
import { CUSTOM_FIELD_VALUE_DETAILS } from './CustomFieldFragment';

export const EMPLOYEE_CONTRACT_REPLACED_EMPLOYEES_DETAILS = gql`
  fragment EmployeeContractReplacedEmployeeDetailsFragment on EmployeeContractReplacedEmployeeType {
    id
    employee{
        id
        firstName
        lastName
        photo
        position
    }
    position
    reason
    startingDate
    endingDate
  }
`;

export const EMPLOYEE_CONTRACT_MISSION_DETAILS = gql`
  fragment EmployeeContractMissionDetailsFragment on EmployeeContractMissionType {
    id
    mission{
      id
      name
      description
    }
  }
`;
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
    leaveDayInfos{
      restPaidLeaveDays
      acquiredPaidLeaveDaysByMonth
      acquiredPaidLeaveDays
      beingAcquiredPaidLeaveDays
      reportedPaidLeaveDaysPerYear
      totalReportedPaidLeaveDays
      restRwtLeaveDays
      restTemporaryLeaveDays
    }
    contractType
    missions{
      ...EmployeeContractMissionDetailsFragment
    }
    establishments{
      ...EmployeeContractEstablishmentTypeFragment
    }
  }
  ${EMPLOYEE_CONTRACT_MISSION_DETAILS}
  ${EMPLOYEE_CONTRACT_ESTABLISHMENT_DETAILS}
`;

export const EMPLOYEE_CONTRACT_BASIC_INFOS = gql`
  fragment EmployeeContractBasicInfosFragment on EmployeeContractType {
    ...EmployeeContractMiniInfosFragment
    employee{
      id
      firstName
      lastName
      photo
    }
    replacedEmployees{
      ...EmployeeContractReplacedEmployeeDetailsFragment
    }
    customFieldValues{
      ...CustomFieldValueDetailsFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${EMPLOYEE_CONTRACT_MINI_INFOS}
  ${CUSTOM_FIELD_VALUE_DETAILS}
  ${EMPLOYEE_CONTRACT_REPLACED_EMPLOYEES_DETAILS}
`;

export const EMPLOYEE_CONTRACT_DETAILS = gql`
  fragment EmployeeContractDetailsFragment on EmployeeContractType {
    ...EmployeeContractBasicInfosFragment
    initialPaidLeaveDays
    initialRwtDays
    initialTemporaryDays
    observation
    startedAt
    endedAt
  }
  ${EMPLOYEE_CONTRACT_BASIC_INFOS}
`;

export const EMPLOYEE_CONTRACT_RECAP_DETAILS = gql`
  fragment EmployeeContractRecapDetailsFragment on EmployeeContractType {
    ...EmployeeContractBasicInfosFragment
    initialPaidLeaveDays
    initialRwtDays
    initialTemporaryDays
    observation
    startedAt
    endedAt
  }
  ${EMPLOYEE_CONTRACT_BASIC_INFOS}
`;
