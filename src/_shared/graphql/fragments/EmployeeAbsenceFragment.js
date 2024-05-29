// EmployeeAbsenceFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';


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
    title
    startingDateTime
    endingDateTime
    comment
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
      ...EmployeeBasicInfosFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${EMPLOYEE_ABSENCE_ITEM_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;
export const EMPLOYEE_ABSENCE_DETAILS = gql`
  fragment EmployeeAbsenceDetailsFragment on EmployeeAbsenceType {
    ...EmployeeAbsenceBasicInfosFragment
    observation
  }
  ${EMPLOYEE_ABSENCE_BASIC_INFOS}
`;

export const EMPLOYEE_ABSENCE_RECAP_DETAILS = gql`
  fragment EmployeeAbsenceRecapDetailsFragment on EmployeeAbsenceType {
    ...EmployeeAbsenceBasicInfosFragment
    observation
  }
  ${EMPLOYEE_ABSENCE_BASIC_INFOS}
`;
