// EmployeeContractFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';

export const EMPLOYEE_CONTRACT_BASIC_INFOS = gql`
  fragment EmployeeContractBasicInfosFragment on EmployeeContractType {
    id
    number
    title
    document
    position
    salary
    startingDate
    endingDate
    description
    isActive
    contractType{
      id
      name
    }
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const EMPLOYEE_CONTRACT_DETAILS = gql`
  fragment EmployeeContractDetailsFragment on EmployeeContractType {
    ...EmployeeContractBasicInfosFragment
    observation
    startedAt
    endedAt
  }
  ${EMPLOYEE_CONTRACT_BASIC_INFOS}
`;

export const EMPLOYEE_CONTRACT_RECAP_DETAILS = gql`
  fragment EmployeeContractRecapDetailsFragment on EmployeeContractType {
    ...EmployeeContractBasicInfosFragment
    observation
    employee{
      ...EmployeeBasicInfosFragment
    }
    startedAt
    endedAt
  }
  ${EMPLOYEE_CONTRACT_BASIC_INFOS}
  ${EMPLOYEE_BASIC_INFOS}
`;
