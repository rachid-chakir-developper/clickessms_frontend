// ContractTemplateFragment.js

import { gql } from '@apollo/client';

export const CONTRACT_TEMPLATE_MINI_INFOS = gql`
  fragment ContractTemplateMiniInfosFragment on ContractTemplateType {
    id
    image
    title
    contractType
    isActive
  }
`;

export const CONTRACT_TEMPLATE_BASIC_INFOS = gql`
  fragment ContractTemplateBasicInfosFragment on ContractTemplateType {
    ...ContractTemplateMiniInfosFragment
  }
  ${CONTRACT_TEMPLATE_MINI_INFOS}
`;

export const CONTRACT_TEMPLATE_DETAILS = gql`
  fragment ContractTemplateDetailsFragment on ContractTemplateType {
    ...ContractTemplateBasicInfosFragment
    content
  }
  ${CONTRACT_TEMPLATE_BASIC_INFOS}
`;


export const CONTRACT_TEMPLATE_RECAP = gql`
  fragment ContractTemplateRecapDetailsFragment on ContractTemplateType {
    ...ContractTemplateBasicInfosFragment
    content
  }
  ${CONTRACT_TEMPLATE_BASIC_INFOS}
`;
