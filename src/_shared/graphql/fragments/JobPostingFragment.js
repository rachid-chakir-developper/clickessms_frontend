// JobPostingFragment.js

import { gql } from '@apollo/client';
import { JOB_POSITION_MINI_INFOS } from './JobPositionFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const JOB_POSTING_MINI_INFOS = gql`
  fragment JobPostingMiniInfosFragment on JobPostingType {
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

export const JOB_POSTING_BASIC_INFOS = gql`
  fragment JobPostingBasicInfosFragment on JobPostingType {
    ...JobPostingMiniInfosFragment
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
  ${JOB_POSTING_MINI_INFOS}
  ${JOB_POSITION_MINI_INFOS}
`;

export const JOB_POSTING_DETAILS = gql`
  fragment JobPostingDetailsFragment on JobPostingType {
    ...JobPostingBasicInfosFragment
    observation
  }
  ${JOB_POSTING_BASIC_INFOS}
`;

export const JOB_POSTING_RECAP_DETAILS = gql`
  fragment JobPostingRecapDetailsFragment on JobPostingType {
    ...JobPostingBasicInfosFragment
    observation
    createdAt
    updatedAt
  }
  ${JOB_POSTING_BASIC_INFOS}
`;
