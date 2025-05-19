// EmployeeGroupFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const EMPLOYEE_GROUP_MANAGER_DETAILS = gql`
  fragment EmployeeGroupManagerTypeFragment on EmployeeGroupManagerType {
    id
    employee {
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const EMPLOYEE_GROUP_BASIC_INFOS = gql`
  fragment EmployeeGroupBasicInfosFragment on EmployeeGroupType {
    id
    number
    name
    managers{
      ...EmployeeGroupManagerTypeFragment
    }
    image
    description
    isActive
  }
  ${EMPLOYEE_GROUP_MANAGER_DETAILS}
`;

export const EMPLOYEE_GROUP_ITEM_DETAILS = gql`
  fragment EmployeeGroupItemTypeFragment on EmployeeGroupItemType {
    id
    employee {
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
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
