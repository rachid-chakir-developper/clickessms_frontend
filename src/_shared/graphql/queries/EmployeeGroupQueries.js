import { gql } from '@apollo/client';
import { EMPLOYEE_GROUP_BASIC_INFOS, EMPLOYEE_GROUP_DETAILS, EMPLOYEE_GROUP_RECAP_DETAILS } from '../fragments/EmployeeGroupFragment';

export const GET_EMPLOYEE_GROUP = gql`
  query GetEmployeeGroup($id: ID!) {
    employeeGroup(id: $id) {
      ...EmployeeGroupDetailsFragment
    }
  }
  ${EMPLOYEE_GROUP_DETAILS}
`;

export const GET_EMPLOYEE_GROUPS = gql`
  query GetEmployeeGroups($employeeGroupFilter: EmployeeGroupFilterInput, $offset: Int, $limit: Int, $page: Int){
    employeeGroups(employeeGroupFilter : $employeeGroupFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...EmployeeGroupBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_GROUP_BASIC_INFOS}
`;


export const EMPLOYEE_GROUP_RECAP = gql`
  query GetEmployeeGroup($id: ID!) {
    employeeGroup(id: $id) {
      ...EmployeeGroupRecapDetailsFragment
    }
  }
  ${EMPLOYEE_GROUP_RECAP_DETAILS}
`;
// Add more employeeGroup-related queries here
