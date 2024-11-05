import { gql } from '@apollo/client';
import {
  EMPLOYEE_SHIFT_BASIC_INFOS,
  EMPLOYEE_SHIFT_DETAILS,
  EMPLOYEE_SHIFT_RECAP_DETAILS,
} from '../fragments/EmployeeShiftFragment';

export const GET_EMPLOYEE_SHIFT = gql`
  query GetEmployeeShift($id: ID!) {
    employeeShift(id: $id) {
      ...EmployeeShiftDetailsFragment
    }
  }
  ${EMPLOYEE_SHIFT_DETAILS}
`;

export const GET_EMPLOYEE_SHIFTS = gql`
  query GetEmployeeShifts(
    $employeeShiftFilter: EmployeeShiftFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    employeeShifts(
      employeeShiftFilter: $employeeShiftFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...EmployeeShiftBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_SHIFT_BASIC_INFOS}
`;

export const EMPLOYEE_SHIFT_RECAP = gql`
  query GetEmployeeShift($id: ID!) {
    employeeShift(id: $id) {
      ...EmployeeShiftRecapDetailsFragment
    }
  }
  ${EMPLOYEE_SHIFT_RECAP_DETAILS}
`;
// Add more employeeShift-related queries here
