// JobCandidateQueries.js

import { gql } from '@apollo/client';
import {
  JOB_CANDIDATE_BASIC_INFOS,
  JOB_CANDIDATE_DETAILS,
  JOB_CANDIDATE_RECAP_DETAILS,
} from '../fragments/JobCandidateFragment';

export const GET_JOB_CANDIDATE = gql`
  query GetJobCandidate($id: ID!) {
    jobCandidate(id: $id) {
      ...JobCandidateDetailsFragment
    }
  }
  ${JOB_CANDIDATE_DETAILS}
`;

export const GET_JOB_CANDIDATES = gql`
  query GetJobCandidates(
    $jobCandidateFilter: JobCandidateFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    jobCandidates(
      jobCandidateFilter: $jobCandidateFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...JobCandidateBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_BASIC_INFOS}
`;

export const JOB_CANDIDATE_RECAP = gql`
  query GetJobCandidate($id: ID!) {
    jobCandidate(id: $id) {
      ...JobCandidateRecapDetailsFragment
    }
  }
  ${JOB_CANDIDATE_RECAP_DETAILS}
`;
