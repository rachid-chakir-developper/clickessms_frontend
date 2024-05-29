// MeetingFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_BASIC_INFOS, EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';

export const MEETING_ESTABLISHMENT_DETAILS = gql`
  fragment MeetingEstablishmentTypeFragment on MeetingEstablishmentType {
    id
    establishment{
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const EMPLOYEE_MEETING_ITEM_DETAILS = gql`
  fragment MeetingParticipantTypeFragment on MeetingParticipantType {
    id
    employee{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const MEETING_BASIC_INFOS = gql`
  fragment MeetingBasicInfosFragment on MeetingType {
    id
    number
    title
    topic
    meetingMode
    startingDateTime
    endingDateTime
    description
    isActive
    meetingTypes{
      id
      name
      description
    }
    establishments{
      ...MeetingEstablishmentTypeFragment
    }
    participants {
      ...MeetingParticipantTypeFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${MEETING_ESTABLISHMENT_DETAILS}
  ${EMPLOYEE_MEETING_ITEM_DETAILS}
`;

export const BENEFICIARY_MEETING_ITEM_DETAILS = gql`
  fragment MeetingBeneficiaryTypeFragment on MeetingBeneficiaryType {
    id
    beneficiary{
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;


export const MEETING_DECISION_DETAILS = gql`
  fragment MeetingDecisionFragment on MeetingDecisionType {
    id
    decision
    dueDate
    employees{
      ...EmployeeMiniInfosFragment
    }
    forVoters{
      ...EmployeeMiniInfosFragment
    }
    againstVoters{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;


export const MEETING_REVIEW_POINT_DETAILS = gql`
  fragment MeetingReviewPointFragment on MeetingReviewPointType {
    id
    pointToReview
  }
`;

export const MEETING_DETAILS = gql`
  fragment MeetingDetailsFragment on MeetingType {
    ...MeetingBasicInfosFragment
    videoCallLink
    reasons {
      id
      name
      description
    }
    otherReasons
    observation
    notes
    absentParticipants{
      ...EmployeeMiniInfosFragment
    }
    beneficiaries {
      ...MeetingBeneficiaryTypeFragment
    }
    employee {
      ...EmployeeMiniInfosFragment
    }
    meetingDecisions{
      ...MeetingDecisionFragment
    }
    meetingReviewPoints{
      ...MeetingReviewPointFragment
    }
  }
  ${MEETING_BASIC_INFOS}
  ${BENEFICIARY_MEETING_ITEM_DETAILS}
  ${EMPLOYEE_MINI_INFOS}
  ${MEETING_DECISION_DETAILS}
  ${MEETING_REVIEW_POINT_DETAILS}
`;

export const MEETING_RECAP_DETAILS = gql`
  fragment MeetingRecapDetailsFragment on MeetingType {
    ...MeetingBasicInfosFragment
    videoCallLink
    reasons {
      id
      name
      description
    }
    otherReasons
    observation
    notes
    absentParticipants{
      ...EmployeeMiniInfosFragment
    }
    beneficiaries {
      ...MeetingBeneficiaryTypeFragment
    }
    employee {
      ...EmployeeMiniInfosFragment
    }
    meetingDecisions{
      ...MeetingDecisionFragment
    }
    meetingReviewPoints{
      ...MeetingReviewPointFragment
    }
  }
  ${MEETING_BASIC_INFOS}
  ${BENEFICIARY_MEETING_ITEM_DETAILS}
  ${EMPLOYEE_MINI_INFOS}
  ${MEETING_DECISION_DETAILS}
  ${MEETING_REVIEW_POINT_DETAILS}
`;
