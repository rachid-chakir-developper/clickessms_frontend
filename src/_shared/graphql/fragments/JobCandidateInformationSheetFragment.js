// JobCandidateInformationSheetFragment.js

import { gql } from '@apollo/client';
import { JOB_POSITION_MINI_INFOS } from './JobPositionFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { JOB_CANDIDATE_MINI_INFOS } from './JobCandidateFragment';
import { DOCUMENT_RECORD_BASIC_DETAILS } from './DocumentRecordFragment';

export const JOB_CANDIDATE_INFORMATION_SHEET_MINI_INFOS = gql`
  fragment JobCandidateInformationSheetMiniInfosFragment on JobCandidateInformationSheetType {
    id
    firstName
    lastName
    email
    phone
    jobTitle
    status
    isActive
  }
`;

export const JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS = gql`
  fragment JobCandidateInformationSheetBasicInfosFragment on JobCandidateInformationSheetType {
    ...JobCandidateInformationSheetMiniInfosFragment
    description
    comment
    employee{
      ...EmployeeMiniInfosFragment
      company{
        id
      }
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
    documentRecords{
      ... DocumentRecordBasicDetailsFragment
    }
    observation
  }
  ${JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS}
  ${DOCUMENT_RECORD_BASIC_DETAILS}
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
