import { gql } from '@apollo/client';
import {
  CONTRACT_TEMPLATE_BASIC_INFOS,
  CONTRACT_TEMPLATE_DETAILS,
  CONTRACT_TEMPLATE_RECAP,
} from '../fragments/ContractTemplateFragment';

export const GET_CONTRACT_TEMPLATE = gql`
  query GetContractTemplate($id: ID!) {
    contractTemplate(id: $id) {
      ...ContractTemplateDetailsFragment
    }
  }
  ${CONTRACT_TEMPLATE_DETAILS}
`;

export const GET_CONTRACT_TEMPLATES = gql`
  query GetContractTemplates(
    $contractTemplateFilter: ContractTemplateFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    contractTemplates(
      contractTemplateFilter: $contractTemplateFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...ContractTemplateBasicInfosFragment
      }
    }
  }
  ${CONTRACT_TEMPLATE_BASIC_INFOS}
`;

export const GET_CONTRACT_TEMPLATE_RECAP = gql`
  query GetContractTemplate($id: ID!) {
    contractTemplate(id: $id) {
      ...ContractTemplateRecapDetailsFragment
    }
  }
  ${CONTRACT_TEMPLATE_RECAP}
`;

// Add mor
// Add more messageNotification-related queries here

// Add more contractTemplate-related queries here
