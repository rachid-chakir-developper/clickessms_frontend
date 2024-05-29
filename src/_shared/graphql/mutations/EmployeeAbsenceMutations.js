import { gql } from '@apollo/client';
import { EMPLOYEE_ABSENCE_BASIC_INFOS } from '../fragments/EmployeeAbsenceFragment';

export const POST_EMPLOYEE_ABSENCE = gql`
  mutation CreateEmployeeAbsence(
    $employeeAbsenceData: EmployeeAbsenceInput!
  ) {
    createEmployeeAbsence(employeeAbsenceData: $employeeAbsenceData) {
      employeeAbsence {
        ...EmployeeAbsenceBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_ABSENCE_BASIC_INFOS}
`;

export const PUT_EMPLOYEE_ABSENCE = gql`
  mutation UpdateEmployeeAbsence(
    $id: ID!
    $employeeAbsenceData: EmployeeAbsenceInput!
  ) {
    updateEmployeeAbsence(
      id: $id
      employeeAbsenceData: $employeeAbsenceData
    ) {
      employeeAbsence {
        ...EmployeeAbsenceBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_ABSENCE_BASIC_INFOS}
`;

export const PUT_EMPLOYEE_ABSENCE_STATE = gql`
  mutation UpdateEmployeeAbsenceState($id: ID!) {
    updateEmployeeAbsenceState(id: $id) {
      done
      success
      message
      employeeAbsence {
        ...EmployeeAbsenceBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_ABSENCE_BASIC_INFOS}
`;

export const DELETE_EMPLOYEE_ABSENCE = gql`
  mutation DeleteEmployeeAbsence($id: ID!) {
    deleteEmployeeAbsence(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
