// EmployeeAbsenceFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';


export const EMPLOYEE_ABSENCE_ITEM_DETAILS = gql`
  fragment EmployeeAbsenceItemTypeFragment on EmployeeAbsenceItemType {
    id
    employee {
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const EMPLOYEE_ABSENCE_BASIC_INFOS = gql`
  fragment EmployeeAbsenceBasicInfosFragment on EmployeeAbsenceType {
    id
    number
    label
    document
    entryType
    leaveType
    startingDateTime
    endingDateTime
    duration
    status
    reasons{
      id
      name
      description
    }
    otherReasons
    employees {
      ...EmployeeAbsenceItemTypeFragment
    }
    employee {
      ...EmployeeMiniInfosFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${EMPLOYEE_ABSENCE_ITEM_DETAILS}
  ${EMPLOYEE_MINI_INFOS}
`;
export const EMPLOYEE_ABSENCE_DETAILS = gql`
  fragment EmployeeAbsenceDetailsFragment on EmployeeAbsenceType {
    ...EmployeeAbsenceBasicInfosFragment
    comment
    message
    observation
  }
  ${EMPLOYEE_ABSENCE_BASIC_INFOS}
`;

export const EMPLOYEE_ABSENCE_RECAP_DETAILS = gql`
  fragment EmployeeAbsenceRecapDetailsFragment on EmployeeAbsenceType {
    ...EmployeeAbsenceBasicInfosFragment
    comment
    message
    observation
  }
  ${EMPLOYEE_ABSENCE_BASIC_INFOS}
`;
