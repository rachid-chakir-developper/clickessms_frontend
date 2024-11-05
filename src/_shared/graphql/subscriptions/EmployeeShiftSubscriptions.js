import { gql } from '@apollo/client';
import {
  EMPLOYEE_SHIFT_BASIC_INFOS,
  EMPLOYEE_SHIFT_DETAILS,
} from '../fragments/EmployeeShiftFragment';

export const ON_EMPLOYEE_SHIFT_ADDED = gql`
  subscription onEmployeeShiftAdded {
    onEmployeeShiftAdded {
      employeeShift {
        ...EmployeeShiftDetailsFragment
      }
    }
  }
  ${EMPLOYEE_SHIFT_DETAILS}
`;

export const ON_EMPLOYEE_SHIFT_UPDATED = gql`
  subscription onEmployeeShiftUpdated {
    onEmployeeShiftUpdated {
      employeeShift {
        ...EmployeeShiftBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_SHIFT_BASIC_INFOS}
`;

export const ON_EMPLOYEE_SHIFT_DELETED = gql`
  subscription onEmployeeShiftDeleted {
    onEmployeeShiftDeleted {
      employeeShift {
        ...EmployeeShiftBasicInfosFragment
      }
    }
  }
  ${EMPLOYEE_SHIFT_BASIC_INFOS}
`;

// Similar subscriptions can be defined for Client and Employee entities.
