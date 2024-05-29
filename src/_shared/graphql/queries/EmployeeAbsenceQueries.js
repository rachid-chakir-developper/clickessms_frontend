import { gql } from '@apollo/client';
import {
  EMPLOYEE_ABSENCE_BASIC_INFOS,
  EMPLOYEE_ABSENCE_DETAILS,
  EMPLOYEE_ABSENCE_RECAP_DETAILS,
} from '../fragments/EmployeeAbsenceFragment';

export const GET_EMPLOYEE_ABSENCE = gql`
  query GetEmployeeAbsence($id: ID!) {
    employeeAbsence(id: $id) {
      ...EmployeeAbsenceDetailsFragment
    }
  }
  ${EMPLOYEE_ABSENCE_DETAILS}
`;

export const GET_EMPLOYEE_ABSENCES = gql`
  query GetEmployeeAbsences(
    $employeeAbsenceFilter: EmployeeAbsenceFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    employeeAbsences(
      employeeAbsenceFilter: $employeeAbsenceFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...EmployeeAbsenceBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_ABSENCE_BASIC_INFOS}
`;

export const EMPLOYEE_ABSENCE_RECAP = gql`
  query GetEmployeeAbsence($id: ID!) {
    employeeAbsence(id: $id) {
      ...EmployeeAbsenceRecapDetailsFragment
    }
  }
  ${EMPLOYEE_ABSENCE_RECAP_DETAILS}
`;
// Add more employeeAbsence-related queries here
