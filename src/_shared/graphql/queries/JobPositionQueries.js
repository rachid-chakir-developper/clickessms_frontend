// JobPositionQueries.js

import { gql } from '@apollo/client';
import {
  JOB_POSITION_BASIC_INFOS,
  JOB_POSITION_DETAILS,
  JOB_POSITION_RECAP_DETAILS,
} from '../fragments/JobPositionFragment';

export const GET_JOB_POSITION = gql`
  query GetJobPosition($id: ID!) {
    jobPosition(id: $id) {
      ...JobPositionDetailsFragment
    }
  }
  ${JOB_POSITION_DETAILS}
`;

export const GET_JOB_POSITIONS = gql`
  query GetJobPositions(
    $jobPositionFilter: JobPositionFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    jobPositions(
      jobPositionFilter: $jobPositionFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...JobPositionBasicInfosFragment
      }
    }
  }
  ${JOB_POSITION_BASIC_INFOS}
`;

export const JOB_POSITION_RECAP = gql`
  query GetJobPosition($id: ID!) {
    jobPosition(id: $id) {
      ...JobPositionRecapDetailsFragment
    }
  }
  ${JOB_POSITION_RECAP_DETAILS}
`;
