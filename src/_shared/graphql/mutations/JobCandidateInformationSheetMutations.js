// JobCandidateInformationSheetMutations.js

import { gql } from '@apollo/client';
import { JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS } from '../fragments/JobCandidateInformationSheetFragment';

export const POST_JOB_CANDIDATE_INFORMATION_SHEET = gql`
  mutation CreateJobCandidateInformationSheet(
    $jobCandidateInformationSheetData: JobCandidateInformationSheetInput!
  ) {
    createJobCandidateInformationSheet(
      jobCandidateInformationSheetData: $jobCandidateInformationSheetData
    ) {
      jobCandidateInformationSheet {
        ...JobCandidateInformationSheetBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS}
`;

export const PUT_JOB_CANDIDATE_INFORMATION_SHEET = gql`
  mutation UpdateJobCandidateInformationSheet(
    $id: ID!
    $jobCandidateInformationSheetData: JobCandidateInformationSheetInput!
  ) {
    updateJobCandidateInformationSheet(
      id: $id
      jobCandidateInformationSheetData: $jobCandidateInformationSheetData
    ) {
      jobCandidateInformationSheet {
        ...JobCandidateInformationSheetBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS}
`;

export const PUT_JOB_CANDIDATE_INFORMATION_SHEET_FIELDS = gql`
  mutation UpdateJobCandidateInformationSheetFields($id: ID!, $jobCandidateInformationSheetData: JobCandidateInformationSheetFieldInput!) {
    updateJobCandidateInformationSheetFields(id: $id, jobCandidateInformationSheetData: $jobCandidateInformationSheetData) {
      done
      success
      message
      jobCandidateInformationSheet {
        ...JobCandidateInformationSheetBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS}
`;


export const GENERATE_JOB_CANDIDATE_INFORMATION_SHEET = gql`
  mutation GenerateJobCandidateInformationSheet($generateJobCandidateInformationSheetData: GenerateJobCandidateInformationSheetInput!) {
    generateJobCandidateInformationSheet(generateJobCandidateInformationSheetData: $generateJobCandidateInformationSheetData) {
      success
      message
      jobCandidateInformationSheets{
        ...JobCandidateInformationSheetBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS}
`;

export const DELETE_JOB_CANDIDATE_INFORMATION_SHEET = gql`
  mutation DeleteJobCandidateInformationSheet($id: ID!) {
    deleteJobCandidateInformationSheet(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
