// EmployeeShiftFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';
import { EMPLOYEE_GROUP_BASIC_INFOS } from './EmployeeGroupFragment';

export const EMPLOYEE_SHIFT_BASIC_INFOS = gql`
  fragment EmployeeShiftBasicInfosFragment on EmployeeShiftType {
    id
    number
    title
    description
    isRecurring
    recurrenceRule
    shiftType
    startingDateTime
    endingDateTime
    scheduledDateTime
    status
    employee{
        ...EmployeeBasicInfosFragment
    }
    employeeGroup{
        ...EmployeeGroupBasicInfosFragment
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
  ${EMPLOYEE_GROUP_BASIC_INFOS}
`;

export const EMPLOYEE_SHIFT_DETAILS = gql`
  fragment EmployeeShiftDetailsFragment on EmployeeShiftType {
    ...EmployeeShiftBasicInfosFragment
  }
  ${EMPLOYEE_SHIFT_BASIC_INFOS}
`;

export const EMPLOYEE_SHIFT_RECAP_DETAILS = gql`
  fragment EmployeeShiftRecapDetailsFragment on EmployeeShiftType {
    ...EmployeeShiftBasicInfosFragment
    createdAt
    updatedAt
  }
  ${EMPLOYEE_SHIFT_BASIC_INFOS}
`;
