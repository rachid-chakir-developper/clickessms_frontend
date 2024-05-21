import { gql } from '@apollo/client';
import {
  EMPLOYEE_CONTRACT_BASIC_INFOS,
  EMPLOYEE_CONTRACT_DETAILS,
  EMPLOYEE_CONTRACT_RECAP_DETAILS,
} from '../fragments/EmployeeContractFragment';

export const GET_EMPLOYEE_CONTRACT = gql`
  query GetEmployeeContract($id: ID!) {
    employeeContract(id: $id) {
      ...EmployeeContractDetailsFragment
    }
  }
  ${EMPLOYEE_CONTRACT_DETAILS}
`;

export const GET_EMPLOYEE_CONTRACTS = gql`
  query GetEmployeeContracts(
    $employeeContractFilter: EmployeeContractFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    employeeContracts(
      employeeContractFilter: $employeeContractFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...EmployeeContractBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_CONTRACT_BASIC_INFOS}
`;

export const EMPLOYEE_CONTRACT_RECAP = gql`
  query GetEmployeeContract($id: ID!) {
    employeeContract(id: $id) {
      ...EmployeeContractRecapDetailsFragment
    }
  }
  ${EMPLOYEE_CONTRACT_RECAP_DETAILS}
`;
// Add more employeeContract-related queries here
