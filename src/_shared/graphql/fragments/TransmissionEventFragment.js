// TransmissionEventFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';

export const TRANSMISSION_EVENT_BENEFICIARY_DETAILS = gql`
  fragment TransmissionEventBeneficiaryTypeFragment on TransmissionEventBeneficiaryType {
    id
    beneficiary {
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const TRANSMISSION_EVENT_BASIC_INFOS = gql`
  fragment TransmissionEventBasicInfosFragment on TransmissionEventType {
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
      ...TransmissionEventBeneficiaryTypeFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
  ${TRANSMISSION_EVENT_BENEFICIARY_DETAILS}
`;

export const TRANSMISSION_EVENT_DETAILS = gql`
  fragment TransmissionEventDetailsFragment on TransmissionEventType {
    ...TransmissionEventBasicInfosFragment
    observation
  }
  ${TRANSMISSION_EVENT_BASIC_INFOS}
`;

export const TRANSMISSION_EVENT_RECAP_DETAILS = gql`
  fragment TransmissionEventRecapDetailsFragment on TransmissionEventType {
    ...TransmissionEventBasicInfosFragment
    observation
    createdAt
    updatedAt
  }
  ${TRANSMISSION_EVENT_BASIC_INFOS}
`;
