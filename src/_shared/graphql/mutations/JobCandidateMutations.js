// JobCandidateMutations.js

import { gql } from '@apollo/client';
import { JOB_CANDIDATE_BASIC_INFOS } from '../fragments/JobCandidateFragment';

export const POST_JOB_CANDIDATE = gql`
  mutation CreateJobCandidate(
    $jobCandidateData: JobCandidateInput!
    $cv: Upload
    $coverLetter: Upload
  ) {
    createJobCandidate(
      jobCandidateData: $jobCandidateData
      cv: $cv
      coverLetter: $coverLetter
    ) {
      jobCandidate {
        ...JobCandidateBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_BASIC_INFOS}
`;

export const PUT_JOB_CANDIDATE = gql`
  mutation UpdateJobCandidate(
    $id: ID!
    $jobCandidateData: JobCandidateInput!
    $cv: Upload
    $coverLetter: Upload
  ) {
    updateJobCandidate(
      id: $id
      jobCandidateData: $jobCandidateData
      cv: $cv
      coverLetter: $coverLetter
    ) {
      jobCandidate {
        ...JobCandidateBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_BASIC_INFOS}
`;

export const PUT_JOB_CANDIDATE_FIELDS = gql`
  mutation UpdateJobCandidateFields($id: ID!, $jobCandidateData: JobCandidateInput!) {
    updateJobCandidateFields(id: $id, jobCandidateData: $jobCandidateData) {
      done
      success
      message
      jobCandidate {
        ...JobCandidateBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_BASIC_INFOS}
`;


export const DELETE_JOB_CANDIDATE = gql`
  mutation DeleteJobCandidate($id: ID!) {
    deleteJobCandidate(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
