// JobCandidateApplicationMutations.js

import { gql } from '@apollo/client';
import { JOB_CANDIDATE_APPLICATION_BASIC_INFOS } from '../fragments/JobCandidateApplicationFragment';

export const POST_JOB_CANDIDATE_APPLICATION = gql`
  mutation CreateJobCandidateApplication(
    $jobCandidateApplicationData: JobCandidateApplicationInput!
    $cv: Upload
    $coverLetter: Upload
  ) {
    createJobCandidateApplication(
      jobCandidateApplicationData: $jobCandidateApplicationData
      cv: $cv
      coverLetter: $coverLetter
    ) {
      jobCandidateApplication {
        ...JobCandidateApplicationBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_APPLICATION_BASIC_INFOS}
`;

export const PUT_JOB_CANDIDATE_APPLICATION = gql`
  mutation UpdateJobCandidateApplication(
    $id: ID!
    $jobCandidateApplicationData: JobCandidateApplicationInput!
    $cv: Upload
    $coverLetter: Upload
  ) {
    updateJobCandidateApplication(
      id: $id
      jobCandidateApplicationData: $jobCandidateApplicationData
      cv: $cv
      coverLetter: $coverLetter
    ) {
      jobCandidateApplication {
        ...JobCandidateApplicationBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_APPLICATION_BASIC_INFOS}
`;

export const PUT_JOB_CANDIDATE_APPLICATION_FIELDS = gql`
  mutation UpdateJobCandidateApplicationFields($id: ID!, $jobCandidateApplicationData: JobCandidateApplicationInput!) {
    updateJobCandidateApplicationFields(id: $id, jobCandidateApplicationData: $jobCandidateApplicationData) {
      done
      success
      message
      jobCandidateApplication {
        ...JobCandidateApplicationBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_APPLICATION_BASIC_INFOS}
`;


export const GENERATE_JOB_CANDIDATE_APPLICATION = gql`
  mutation GenerateJobCandidateApplication($generateJobCandidateApplicationData: GenerateJobCandidateApplicationInput!) {
    generateJobCandidateApplication(generateJobCandidateApplicationData: $generateJobCandidateApplicationData) {
      success
      message
      jobCandidateApplications{
        ...JobCandidateApplicationBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_APPLICATION_BASIC_INFOS}
`;

export const DELETE_JOB_CANDIDATE_APPLICATION = gql`
  mutation DeleteJobCandidateApplication($id: ID!) {
    deleteJobCandidateApplication(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
