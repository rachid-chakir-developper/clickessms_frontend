import { gql } from '@apollo/client';
import { EMPLOYEE_CONTRACT_BASIC_INFOS } from '../fragments/EmployeeContractFragment';

export const POST_EMPLOYEE_CONTRACT = gql`
  mutation CreateEmployeeContract(
    $employeeContractData: EmployeeContractInput!
    $document: Upload
  ) {
    createEmployeeContract(employeeContractData: $employeeContractData, document: $document) {
      employeeContract {
        ...EmployeeContractBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_CONTRACT_BASIC_INFOS}
`;

export const PUT_EMPLOYEE_CONTRACT = gql`
  mutation UpdateEmployeeContract(
    $id: ID!
    $employeeContractData: EmployeeContractInput!
    $document: Upload
  ) {
    updateEmployeeContract(
      id: $id
      employeeContractData: $employeeContractData
      document: $document
    ) {
      employeeContract {
        ...EmployeeContractBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_CONTRACT_BASIC_INFOS}
`;

export const PUT_EMPLOYEE_CONTRACT_STATE = gql`
  mutation UpdateEmployeeContractState($id: ID!) {
    updateEmployeeContractState(id: $id) {
      done
      success
      message
      employeeContract {
        ...EmployeeContractBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_CONTRACT_BASIC_INFOS}
`;

export const DELETE_EMPLOYEE_CONTRACT = gql`
  mutation DeleteEmployeeContract($id: ID!) {
    deleteEmployeeContract(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
