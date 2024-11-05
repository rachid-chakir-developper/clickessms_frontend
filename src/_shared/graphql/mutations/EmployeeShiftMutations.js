import { gql } from '@apollo/client';
import { EMPLOYEE_SHIFT_BASIC_INFOS } from '../fragments/EmployeeShiftFragment';

export const POST_EMPLOYEE_SHIFT = gql`
  mutation CreateEmployeeShift(
    $employeeShiftData: EmployeeShiftInput!
  ) {
    createEmployeeShift(employeeShiftData: $employeeShiftData) {
      employeeShift {
        ...EmployeeShiftBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_SHIFT_BASIC_INFOS}
`;

export const PUT_EMPLOYEE_SHIFT = gql`
  mutation UpdateEmployeeShift(
    $id: ID!
    $employeeShiftData: EmployeeShiftInput!
  ) {
    updateEmployeeShift(
      id: $id
      employeeShiftData: $employeeShiftData
    ) {
      employeeShift {
        ...EmployeeShiftBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_SHIFT_BASIC_INFOS}
`;

export const DELETE_EMPLOYEE_SHIFT = gql`
  mutation DeleteEmployeeShift($id: ID!) {
    deleteEmployeeShift(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
