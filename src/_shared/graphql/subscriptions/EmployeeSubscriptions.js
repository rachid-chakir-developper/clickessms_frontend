import { gql } from '@apollo/client';
import { EMPLOYEE_DETAILS } from '../fragments/EmployeeFragment';

export const EMPLOYEE_CREATED_SUBSCRIPTION = gql`
  subscription EmployeeCreated {
    employeeCreated {
      ...EmployeeDetailsFragment
      // Include other employee fields
    }
  }
  ${EMPLOYEE_DETAILS}
`;

export const EMPLOYEE_UPDATED_SUBSCRIPTION = gql`
  subscription EmployeeUpdated {
    employeeUpdated {
      ...EmployeeDetailsFragment
      // Include other employee fields
    }
  }
  ${EMPLOYEE_DETAILS}
`;

export const EMPLOYEE_DELETED_SUBSCRIPTION = gql`
  subscription EmployeeDeleted {
    employeeDeleted {
      id
    }
  }
`;

// Add more employee-related subscriptions here
