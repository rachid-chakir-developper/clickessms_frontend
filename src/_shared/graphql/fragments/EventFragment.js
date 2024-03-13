// EventFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';

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
  }
`;

export const EVENT_BENEFICIARY_DETAILS = gql`
  fragment EventBeneficiaryTypeFragment on EventBeneficiaryType {
    id
    beneficiary{
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const EVENT_DETAILS = gql`
  fragment EventDetailsFragment on EventType {
    ...EventBasicInfosFragment
    observation
    beneficiaries{
      ...EventBeneficiaryTypeFragment
    }
  }
  ${EVENT_BASIC_INFOS}
  ${EVENT_BENEFICIARY_DETAILS}
`;

export const EVENT_RECAP_DETAILS = gql`
  fragment EventRecapDetailsFragment on EventType {
    ...EventBasicInfosFragment
    observation
    beneficiaries{
      ...EventBeneficiaryTypeFragment
    }
  }
  ${EVENT_BASIC_INFOS}
  ${EVENT_BENEFICIARY_DETAILS}
`;

