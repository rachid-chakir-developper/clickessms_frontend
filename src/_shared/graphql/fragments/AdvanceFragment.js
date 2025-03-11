// AdvanceFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const ADVANCE_MINI_INFOS = gql`
  fragment AdvanceMiniInfosFragment on AdvanceType {
    id
    number
    amount
    month
    status
    isActive
  }
`;

export const ADVANCE_BASIC_INFOS = gql`
  fragment AdvanceBasicInfosFragment on AdvanceType {
    ...AdvanceMiniInfosFragment
    reason
    comments
    validationDate
    createdAt
    employee {
      ...EmployeeMiniInfosFragment
    }
    validatedBy {
      ...EmployeeMiniInfosFragment
    }
  }
  ${ADVANCE_MINI_INFOS}
  ${EMPLOYEE_MINI_INFOS}
`;

export const ADVANCE_DETAILS = gql`
  fragment AdvanceDetailsFragment on AdvanceType {
    ...AdvanceBasicInfosFragment
  }
  ${ADVANCE_BASIC_INFOS}
`; 