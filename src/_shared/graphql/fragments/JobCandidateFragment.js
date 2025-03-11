// JobCandidateFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const JOB_CANDIDATE_MINI_INFOS = gql`
  fragment JobCandidateMiniInfosFragment on JobCandidateType {
    id
    firstName
    lastName
    email
    phone
    jobTitle
    rating
    isActive
  }
`;

export const JOB_CANDIDATE_BASIC_INFOS = gql`
  fragment JobCandidateBasicInfosFragment on JobCandidateType {
    ...JobCandidateMiniInfosFragment
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
    folder {
      id
      name
    }
  }
  ${EMPLOYEE_MINI_INFOS}
  ${JOB_CANDIDATE_MINI_INFOS}
`;

export const JOB_CANDIDATE_DETAILS = gql`
  fragment JobCandidateDetailsFragment on JobCandidateType {
    ...JobCandidateBasicInfosFragment
    observation
  }
  ${JOB_CANDIDATE_BASIC_INFOS}
`;

export const JOB_CANDIDATE_RECAP_DETAILS = gql`
  fragment JobCandidateRecapDetailsFragment on JobCandidateType {
    ...JobCandidateBasicInfosFragment
    observation
    createdAt
    updatedAt
  }
  ${JOB_CANDIDATE_BASIC_INFOS}
`;
