// JobPositionMutations.js

import { gql } from '@apollo/client';
import { JOB_POSITION_BASIC_INFOS } from '../fragments/JobPositionFragment';

export const POST_JOB_POSITION = gql`
  mutation CreateJobPosition(
    $jobPositionData: JobPositionInput!
  ) {
    createJobPosition(
      jobPositionData: $jobPositionData
    ) {
      jobPosition {
        ...JobPositionBasicInfosFragment
      }
    }
  }
  ${JOB_POSITION_BASIC_INFOS}
`;

export const PUT_JOB_POSITION = gql`
  mutation UpdateJobPosition(
    $id: ID!
    $jobPositionData: JobPositionInput!
  ) {
    updateJobPosition(
      id: $id
      jobPositionData: $jobPositionData
    ) {
      jobPosition {
        ...JobPositionBasicInfosFragment
      }
    }
  }
  ${JOB_POSITION_BASIC_INFOS}
`;

export const DELETE_JOB_POSITION = gql`
  mutation DeleteJobPosition($id: ID!) {
    deleteJobPosition(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
