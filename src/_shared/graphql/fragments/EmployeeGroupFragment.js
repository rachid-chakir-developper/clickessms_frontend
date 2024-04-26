// EmployeeGroupFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';

export const EMPLOYEE_GROUP_BASIC_INFOS = gql`
  fragment EmployeeGroupBasicInfosFragment on EmployeeGroupType {
    id
    number
    name
    image
    description
    isActive
  }
`;

export const EMPLOYEE_GROUP_ITEM_DETAILS = gql`
  fragment EmployeeGroupItemTypeFragment on EmployeeGroupItemType {
    id
    employee {
      ...EmployeeBasicInfosFragment
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const EMPLOYEE_GROUP_DETAILS = gql`
  fragment EmployeeGroupDetailsFragment on EmployeeGroupType {
    ...EmployeeGroupBasicInfosFragment
    observation
    employees {
      ...EmployeeGroupItemTypeFragment
    }
  }
  ${EMPLOYEE_GROUP_BASIC_INFOS}
  ${EMPLOYEE_GROUP_ITEM_DETAILS}
`;

export const EMPLOYEE_GROUP_RECAP_DETAILS = gql`
  fragment EmployeeGroupRecapDetailsFragment on EmployeeGroupType {
    ...EmployeeGroupBasicInfosFragment
    observation
    employees {
      ...EmployeeGroupItemTypeFragment
    }
  }
  ${EMPLOYEE_GROUP_BASIC_INFOS}
  ${EMPLOYEE_GROUP_ITEM_DETAILS}
`;
