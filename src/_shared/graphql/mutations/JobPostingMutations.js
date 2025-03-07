// JobPostingMutations.js

import { gql } from '@apollo/client';
import { JOB_POSTING_BASIC_INFOS } from '../fragments/JobPostingFragment';

export const POST_JOB_POSTING = gql`
  mutation CreateJobPosting(
    $jobPostingData: JobPostingInput!
    $cv: Upload
    $coverLetter: Upload
  ) {
    createJobPosting(
      jobPostingData: $jobPostingData
      cv: $cv
      coverLetter: $coverLetter
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
    $cv: Upload
    $coverLetter: Upload
  ) {
    updateJobPosting(
      id: $id
      jobPostingData: $jobPostingData
      cv: $cv
      coverLetter: $coverLetter
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
