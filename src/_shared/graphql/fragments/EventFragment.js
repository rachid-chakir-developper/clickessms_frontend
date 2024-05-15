// EventFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';

export const EVENT_BENEFICIARY_DETAILS = gql`
  fragment EventBeneficiaryTypeFragment on EventBeneficiaryType {
    id
    beneficiary {
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const EVENT_BASIC_INFOS = gql`
  fragment EventBasicInfosFragment on EventType {
    id
    number
    title
    image
    startingDateTime
    endingDateTime
    description
    isActive
    employee {
      ...EmployeeBasicInfosFragment
    }
    beneficiaries {
      ...EventBeneficiaryTypeFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
  ${EVENT_BENEFICIARY_DETAILS}
`;

export const EVENT_DETAILS = gql`
  fragment EventDetailsFragment on EventType {
    ...EventBasicInfosFragment
    observation
  }
  ${EVENT_BASIC_INFOS}
`;

export const EVENT_RECAP_DETAILS = gql`
  fragment EventRecapDetailsFragment on EventType {
    ...EventBasicInfosFragment
    observation
  }
  ${EVENT_BASIC_INFOS}
`;
