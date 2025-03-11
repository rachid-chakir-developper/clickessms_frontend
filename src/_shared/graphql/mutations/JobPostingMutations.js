// JobPostingMutations.js

import { gql } from '@apollo/client';
import { JOB_POSTING_BASIC_INFOS } from '../fragments/JobPostingFragment';

export const POST_JOB_POSTING = gql`
  mutation CreateJobPosting(
    $jobPostingData: JobPostingInput!
  ) {
    createJobPosting(
      jobPostingData: $jobPostingData
    ) {
      jobPosting {
        ...JobPostingBasicInfosFragment
      }
    }
  }
  ${JOB_POSTING_BASIC_INFOS}
`;

export const PUT_JOB_POSTING = gql`
  mutation UpdateJobPosting(
    $id: ID!
    $jobPostingData: JobPostingInput!
  ) {
    updateJobPosting(
      id: $id
      jobPostingData: $jobPostingData
    ) {
      jobPosting {
        ...JobPostingBasicInfosFragment
      }
    }
  }
  ${JOB_POSTING_BASIC_INFOS}
`;

export const DELETE_JOB_POSTING = gql`
  mutation DeleteJobPosting($id: ID!) {
    deleteJobPosting(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
