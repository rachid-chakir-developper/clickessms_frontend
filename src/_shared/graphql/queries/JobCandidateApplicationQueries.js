// JobCandidateApplicationQueries.js

import { gql } from '@apollo/client';
import {
  JOB_CANDIDATE_APPLICATION_BASIC_INFOS,
  JOB_CANDIDATE_APPLICATION_DETAILS,
  JOB_CANDIDATE_APPLICATION_RECAP_DETAILS,
} from '../fragments/JobCandidateApplicationFragment';

export const GET_JOB_CANDIDATE_APPLICATION = gql`
  query GetJobCandidateApplication($id: ID!) {
    jobCandidateApplication(id: $id) {
      ...JobCandidateApplicationDetailsFragment
    }
  }
  ${JOB_CANDIDATE_APPLICATION_DETAILS}
`;

export const GET_JOB_CANDIDATE_APPLICATIONS = gql`
  query GetJobCandidateApplications(
    $jobCandidateApplicationFilter: JobCandidateApplicationFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    jobCandidateApplications(
      jobCandidateApplicationFilter: $jobCandidateApplicationFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...JobCandidateApplicationBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_APPLICATION_BASIC_INFOS}
`;

export const JOB_CANDIDATE_APPLICATION_RECAP = gql`
  query GetJobCandidateApplication($id: ID!) {
    jobCandidateApplication(id: $id) {
      ...JobCandidateApplicationRecapDetailsFragment
    }
  }
  ${JOB_CANDIDATE_APPLICATION_RECAP_DETAILS}
`;
