// JobCandidateApplicationFragment.js

import { gql } from '@apollo/client';
import { JOB_POSITION_MINI_INFOS } from './JobPositionFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const JOB_CANDIDATE_APPLICATION_MINI_INFOS = gql`
  fragment JobCandidateApplicationMiniInfosFragment on JobCandidateApplicationType {
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

export const JOB_CANDIDATE_APPLICATION_BASIC_INFOS = gql`
  fragment JobCandidateApplicationBasicInfosFragment on JobCandidateApplicationType {
    ...JobCandidateApplicationMiniInfosFragment
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
    folder {
      id
      name
    }
  }
  ${EMPLOYEE_MINI_INFOS}
  ${JOB_CANDIDATE_APPLICATION_MINI_INFOS}
  ${JOB_POSITION_MINI_INFOS}
`;

export const JOB_CANDIDATE_APPLICATION_DETAILS = gql`
  fragment JobCandidateApplicationDetailsFragment on JobCandidateApplicationType {
    ...JobCandidateApplicationBasicInfosFragment
    observation
  }
  ${JOB_CANDIDATE_APPLICATION_BASIC_INFOS}
`;

export const JOB_CANDIDATE_APPLICATION_RECAP_DETAILS = gql`
  fragment JobCandidateApplicationRecapDetailsFragment on JobCandidateApplicationType {
    ...JobCandidateApplicationBasicInfosFragment
    observation
    createdAt
    updatedAt
  }
  ${JOB_CANDIDATE_APPLICATION_BASIC_INFOS}
`;
