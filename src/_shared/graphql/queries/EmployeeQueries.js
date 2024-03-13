import { gql } from '@apollo/client';
import { EMPLOYEE_BASIC_INFOS, EMPLOYEE_DETAILS } from '../fragments/EmployeeFragment';

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      ...EmployeeDetailsFragment
    }
  }
  ${EMPLOYEE_DETAILS}
`;

export const GET_EMPLOYEES = gql`
  query GetEmployees($employeeFilter: EmployeeFilterInput, $offset: Int, $limit: Int, $page: Int){
    employees(employeeFilter : $employeeFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...EmployeeBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

// Add more employee-related queries here
