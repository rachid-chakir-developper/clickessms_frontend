// SceBenefitFragment.js

import { gql } from '@apollo/client';

export const SCE_BENEFIT_PHONE_INFOS = gql`
  fragment SceBenefitPhoneInfosFragment on SceBenefitType {
    id
    title
    isActive
  }
`;

export const SCE_BENEFIT_MINI_INFOS = gql`
  fragment SceBenefitMiniInfosFragment on SceBenefitType {
    id
    title
    content
    isActive
  }
`;

export const SCE_BENEFIT_BASIC_INFOS = gql`
  fragment SceBenefitBasicInfosFragment on SceBenefitType {
    ...SceBenefitMiniInfosFragment
    folder {
      id
      number
      name
    }
  }
  ${SCE_BENEFIT_MINI_INFOS}
`;

export const SCE_BENEFIT_DETAILS = gql`
  fragment SceBenefitDetailsFragment on SceBenefitType {
    ...SceBenefitBasicInfosFragment
    description
    observation
  }
  ${SCE_BENEFIT_BASIC_INFOS}
`;


export const SCE_BENEFIT_RECAP = gql`
  fragment SceBenefitRecapDetailsFragment on SceBenefitType {
    ...SceBenefitBasicInfosFragment
    description
    observation
  }
  ${SCE_BENEFIT_BASIC_INFOS}
`;
