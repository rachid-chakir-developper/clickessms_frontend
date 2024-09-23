import { gql } from '@apollo/client';
import { SCE_BENEFIT_BASIC_INFOS } from '../fragments/SceBenefitFragment';

export const POST_SCE_BENEFIT = gql`
  mutation CreateSceBenefit(
    $sceBenefitData: SceBenefitInput!
  ) {
    createSceBenefit(
      sceBenefitData: $sceBenefitData
    ) {
      sceBenefit {
        ...SceBenefitBasicInfosFragment
      }
    }
  }
  ${SCE_BENEFIT_BASIC_INFOS}
`;

export const PUT_SCE_BENEFIT = gql`
  mutation UpdateSceBenefit(
    $id: ID!
    $sceBenefitData: SceBenefitInput!
  ) {
    updateSceBenefit(
      id: $id
      sceBenefitData: $sceBenefitData
    ) {
      sceBenefit {
        ...SceBenefitBasicInfosFragment
      }
    }
  }
  ${SCE_BENEFIT_BASIC_INFOS}
`;

export const PUT_SCE_BENEFIT_STATE = gql`
  mutation UpdateSceBenefitState($id: ID!) {
    updateSceBenefitState(id: $id) {
      done
      success
      message
      sceBenefit {
        ...SceBenefitBasicInfosFragment
      }
    }
  }
  ${SCE_BENEFIT_BASIC_INFOS}
`;

export const DELETE_SCE_BENEFIT = gql`
  mutation DeleteSceBenefit($id: ID!) {
    deleteSceBenefit(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
