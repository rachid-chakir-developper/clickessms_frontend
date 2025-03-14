// JobCandidateInformationSheetFragment.js

import { gql } from '@apollo/client';
import { JOB_POSITION_MINI_INFOS } from './JobPositionFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { JOB_CANDIDATE_MINI_INFOS } from './JobCandidateFragment';

export const JOB_CANDIDATE_INFORMATION_SHEET_MINI_INFOS = gql`
  fragment JobCandidateInformationSheetMiniInfosFragment on JobCandidateInformationSheetType {
    id
    firstName
    lastName
    email
    phone
    jobTitle
    rating
    status
    isActive
  }
`;

export const JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS = gql`
  fragment JobCandidateInformationSheetBasicInfosFragment on JobCandidateInformationSheetType {
    ...JobCandidateInformationSheetMiniInfosFragment
    availabilityDate
    description
    cv
    coverLetter
    employee{
      ...EmployeeMiniInfosFragment
    }
    jobPlatform{
      id
      name
    }
    jobPosition {
      ...JobPositionMiniInfosFragment
    }
    jobCandidate {
      ...JobCandidateMiniInfosFragment
    }
    folder {
      id
      name
    }
  }
  ${EMPLOYEE_MINI_INFOS}
  ${JOB_CANDIDATE_INFORMATION_SHEET_MINI_INFOS}
  ${JOB_POSITION_MINI_INFOS}
  ${JOB_CANDIDATE_MINI_INFOS}
`;

export const JOB_CANDIDATE_INFORMATION_SHEET_DETAILS = gql`
  fragment JobCandidateInformationSheetDetailsFragment on JobCandidateInformationSheetType {
    ...JobCandidateInformationSheetBasicInfosFragment
    observation
  }
  ${JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS}
`;

export const JOB_CANDIDATE_INFORMATION_SHEET_RECAP_DETAILS = gql`
  fragment JobCandidateInformationSheetRecapDetailsFragment on JobCandidateInformationSheetType {
    ...JobCandidateInformationSheetBasicInfosFragment
    observation
    createdAt
    updatedAt
  }
  ${JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS}
`;
