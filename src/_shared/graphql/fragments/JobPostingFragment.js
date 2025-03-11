// JobPostingFragment.js

import { gql } from '@apollo/client';
import { JOB_POSITION_MINI_INFOS } from './JobPositionFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const JOB_POSTING_MINI_INFOS = gql`
  fragment JobPostingMiniInfosFragment on JobPostingType {
    id
    title
  }
`;

export const JOB_POSTING_BASIC_INFOS = gql`
  fragment JobPostingBasicInfosFragment on JobPostingType {
    ...JobPostingMiniInfosFragment
    publicationDate
    expirationDate
    description
    employee{
      ...EmployeeMiniInfosFragment
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

export const JOB_POSTING_PLATFORM_DETAILS = gql`
  fragment JobPostingPlatformFragment on JobPostingPlatformType {
    id
    postLink
    jobPlatform{
      id
      name
    }
  }
`;

export const JOB_POSTING_DETAILS = gql`
  fragment JobPostingDetailsFragment on JobPostingType {
    ...JobPostingBasicInfosFragment
    jobPlatforms{
      ...JobPostingPlatformFragment
    }
    observation
  }
  ${JOB_POSTING_BASIC_INFOS}
  ${JOB_POSTING_PLATFORM_DETAILS}
`;

export const JOB_POSTING_RECAP_DETAILS = gql`
  fragment JobPostingRecapDetailsFragment on JobPostingType {
    ...JobPostingDetailsFragment
    createdAt
    updatedAt
  }
  ${JOB_POSTING_DETAILS}
`;
