// MeetingFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_BASIC_INFOS, EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const MEETING_BASIC_INFOS = gql`
  fragment MeetingBasicInfosFragment on MeetingType {
    id
    number
    title
    startingDateTime
    endingDateTime
    description
    folder{
      id
      number
      name
    }
  }
`;

export const BENEFICIARY_MEETING_ITEM_DETAILS = gql`
  fragment BeneficiaryMeetingItemTypeFragment on BeneficiaryMeetingItemType {
    id
    beneficiary{
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const EMPLOYEE_MEETING_ITEM_DETAILS = gql`
  fragment ParticipantMeetingItemTypeFragment on ParticipantMeetingItemType {
    id
    employee{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const MEETING_DETAILS = gql`
  fragment MeetingDetailsFragment on MeetingType {
    ...MeetingBasicInfosFragment
    videoCallLink
    reasons{
      id
      name
      description
    }
    otherReasons
    observation
    participants{
      ...ParticipantMeetingItemTypeFragment
    }
    beneficiaries{
      ...BeneficiaryMeetingItemTypeFragment
    }
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${MEETING_BASIC_INFOS}
  ${EMPLOYEE_MEETING_ITEM_DETAILS}
  ${BENEFICIARY_MEETING_ITEM_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;

export const MEETING_RECAP_DETAILS = gql`
  fragment MeetingRecapDetailsFragment on MeetingType {
    ...MeetingBasicInfosFragment
    videoCallLink
    reasons{
      id
      name
      description
    }
    otherReasons
    observation
    participants{
      ...ParticipantMeetingItemTypeFragment
    }
    beneficiaries{
      ...BeneficiaryMeetingItemTypeFragment
    }
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${MEETING_BASIC_INFOS}
  ${EMPLOYEE_MEETING_ITEM_DETAILS}
  ${BENEFICIARY_MEETING_ITEM_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;

