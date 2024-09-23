import { gql } from '@apollo/client';
import {
  SCE_BENEFIT_BASIC_INFOS,
  SCE_BENEFIT_DETAILS,
  SCE_BENEFIT_RECAP,
} from '../fragments/SceBenefitFragment';

export const GET_SCE_BENEFIT = gql`
  query GetSceBenefit($id: ID!) {
    sceBenefit(id: $id) {
      ...SceBenefitDetailsFragment
    }
  }
  ${SCE_BENEFIT_DETAILS}
`;

export const GET_SCE_BENEFITS = gql`
  query GetSceBenefits(
    $sceBenefitFilter: SceBenefitFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    sceBenefits(
      sceBenefitFilter: $sceBenefitFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...SceBenefitBasicInfosFragment
      }
    }
  }
  ${SCE_BENEFIT_BASIC_INFOS}
`;

export const GET_SCE_BENEFIT_RECAP = gql`
  query GetSceBenefit($id: ID!) {
    sceBenefit(id: $id) {
      ...SceBenefitRecapDetailsFragment
    }
  }
  ${SCE_BENEFIT_RECAP}
`;

// Add mor
// Add more messageNotification-related queries here

// Add more sceBenefit-related queries here
