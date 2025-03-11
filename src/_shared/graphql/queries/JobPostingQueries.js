// JobPostingQueries.js

import { gql } from '@apollo/client';
import {
  JOB_POSTING_BASIC_INFOS,
  JOB_POSTING_DETAILS,
  JOB_POSTING_RECAP_DETAILS,
} from '../fragments/JobPostingFragment';

export const GET_JOB_POSTING = gql`
  query GetJobPosting($id: ID!) {
    jobPosting(id: $id) {
      ...JobPostingDetailsFragment
    }
  }
  ${JOB_POSTING_DETAILS}
`;

export const GET_JOB_POSTINGS = gql`
  query GetJobPostings(
    $jobPostingFilter: JobPostingFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    jobPostings(
      jobPostingFilter: $jobPostingFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...JobPostingBasicInfosFragment
      }
    }
  }
  ${JOB_POSTING_BASIC_INFOS}
`;

export const JOB_POSTING_RECAP = gql`
  query GetJobPosting($id: ID!) {
    jobPosting(id: $id) {
      ...JobPostingRecapDetailsFragment
    }
  }
  ${JOB_POSTING_RECAP_DETAILS}
`;
