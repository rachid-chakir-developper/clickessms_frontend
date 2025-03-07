// JobPositionFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const JOB_POSITION_MINI_INFOS = gql`
  fragment JobPositionMiniInfosFragment on JobPositionType {
    id
    title
    sector
    contractType
    hiringDate
    isActive
  }
`;

export const JOB_POSITION_BASIC_INFOS = gql`
  fragment JobPositionBasicInfosFragment on JobPositionType {
    ...JobPositionMiniInfosFragment
    duration
    description
    employee{
      ...EmployeeMiniInfosFragment
    }
    establishment {
      ...EstablishmentMiniInfosFragment
    }
  }
  ${JOB_POSITION_MINI_INFOS}
  ${EMPLOYEE_MINI_INFOS}
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const JOB_POSITION_DETAILS = gql`
  fragment JobPositionDetailsFragment on JobPositionType {
    ...JobPositionBasicInfosFragment
    observation
  }
  ${JOB_POSITION_BASIC_INFOS}
`;

export const JOB_POSITION_RECAP_DETAILS = gql`
  fragment JobPositionRecapDetailsFragment on JobPositionType {
    ...JobPositionBasicInfosFragment
    observation
    createdAt
    updatedAt
  }
  ${JOB_POSITION_BASIC_INFOS}
`;
