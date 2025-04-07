import { gql } from '@apollo/client';
import { EMPLOYEE_BASIC_INFOS } from '../fragments/EmployeeFragment';

export const POST_EMPLOYEE = gql`
  mutation CreateEmployee(
    $employeeData: EmployeeInput!
    $photo: Upload
    $coverImage: Upload
    $signature: Upload
  ) {
    createEmployee(
      employeeData: $employeeData
      photo: $photo
      coverImage: $coverImage
      signature: $signature
    ) {
      employee {
        ...EmployeeBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const PUT_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!
    $employeeData: EmployeeInput!
    $photo: Upload
    $coverImage: Upload
    $signature: Upload
  ) {
    updateEmployee(
      id: $id
      employeeData: $employeeData
      photo: $photo
      coverImage: $coverImage
      signature: $signature
    ) {
      employee {
        ...EmployeeBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const PUT_EMPLOYEE_STATE = gql`
  mutation UpdateEmployeeState($id: ID!) {
    updateEmployeeState(id: $id) {
      done
      success
      message
      employee {
        ...EmployeeBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const GENERATE_EMPLOYEE = gql`
  mutation GenerateEmployee($generateEmployeeData: GenerateEmployeeInput!) {
    generateEmployee(generateEmployeeData: $generateEmployeeData) {
      success
      message
      employee{
        ...EmployeeBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
