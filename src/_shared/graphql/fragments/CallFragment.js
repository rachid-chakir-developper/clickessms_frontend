// CallFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';

export const CALL_BASIC_INFOS = gql`
  fragment CallBasicInfosFragment on CallType {
    id
    number
    title
    callType
    image
    entryDateTime
    description
    isActive
  }
`;

export const CALL_BENEFICIARY_DETAILS = gql`
  fragment CallBeneficiaryTypeFragment on CallBeneficiaryType {
    id
    beneficiary{
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const CALL_DETAILS = gql`
  fragment CallDetailsFragment on CallType {
    ...CallBasicInfosFragment
    observation
    beneficiaries{
      ...CallBeneficiaryTypeFragment
    }
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${CALL_BASIC_INFOS}
  ${CALL_BENEFICIARY_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;

export const CALL_RECAP_DETAILS = gql`
  fragment CallRecapDetailsFragment on CallType {
    ...CallBasicInfosFragment
    observation
    beneficiaries{
      ...CallBeneficiaryTypeFragment
    }
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${CALL_BASIC_INFOS}
  ${CALL_BENEFICIARY_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;
