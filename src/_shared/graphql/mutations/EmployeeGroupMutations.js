import { gql } from '@apollo/client';
import { EMPLOYEE_GROUP_BASIC_INFOS } from '../fragments/EmployeeGroupFragment';

export const POST_EMPLOYEE_GROUP = gql`
  mutation CreateEmployeeGroup(
    $employeeGroupData: EmployeeGroupInput!
    $image: Upload
  ) {
    createEmployeeGroup(employeeGroupData: $employeeGroupData, image: $image) {
      employeeGroup {
        ...EmployeeGroupBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_GROUP_BASIC_INFOS}
`;

export const PUT_EMPLOYEE_GROUP = gql`
  mutation UpdateEmployeeGroup(
    $id: ID!
    $employeeGroupData: EmployeeGroupInput!
    $image: Upload
  ) {
    updateEmployeeGroup(
      id: $id
      employeeGroupData: $employeeGroupData
      image: $image
    ) {
      employeeGroup {
        ...EmployeeGroupBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_GROUP_BASIC_INFOS}
`;

export const PUT_EMPLOYEE_GROUP_STATE = gql`
  mutation UpdateEmployeeGroupState($id: ID!) {
    updateEmployeeGroupState(id: $id) {
      done
      success
      message
      employeeGroup {
        ...EmployeeGroupBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_GROUP_BASIC_INFOS}
`;

export const DELETE_EMPLOYEE_GROUP = gql`
  mutation DeleteEmployeeGroup($id: ID!) {
    deleteEmployeeGroup(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
