// JobCandidateInformationSheetQueries.js

import { gql } from '@apollo/client';
import {
  JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS,
  JOB_CANDIDATE_INFORMATION_SHEET_DETAILS,
  JOB_CANDIDATE_INFORMATION_SHEET_RECAP_DETAILS,
} from '../fragments/JobCandidateInformationSheetFragment';

export const GET_JOB_CANDIDATE_INFORMATION_SHEET = gql`
  query GetJobCandidateInformationSheet($id: ID, $accessToken: String) {
    jobCandidateInformationSheet(id: $id, accessToken: $accessToken) {
      ...JobCandidateInformationSheetDetailsFragment
    }
  }
  ${JOB_CANDIDATE_INFORMATION_SHEET_DETAILS}
`;

export const GET_JOB_CANDIDATE_INFORMATION_SHEETS = gql`
  query GetJobCandidateInformationSheets(
    $jobCandidateInformationSheetFilter: JobCandidateInformationSheetFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    jobCandidateInformationSheets(
      jobCandidateInformationSheetFilter: $jobCandidateInformationSheetFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...JobCandidateInformationSheetBasicInfosFragment
      }
    }
  }
  ${JOB_CANDIDATE_INFORMATION_SHEET_BASIC_INFOS}
`;

export const JOB_CANDIDATE_INFORMATION_SHEET_RECAP = gql`
  query GetJobCandidateInformationSheet($id: ID, $accessToken: String) {
    jobCandidateInformationSheet(id: $id, accessToken: $accessToken) {
      ...JobCandidateInformationSheetRecapDetailsFragment
    }
  }
  ${JOB_CANDIDATE_INFORMATION_SHEET_RECAP_DETAILS}
`;
