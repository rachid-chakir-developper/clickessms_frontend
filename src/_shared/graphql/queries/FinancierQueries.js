import { gql } from '@apollo/client';
import {
  FINANCIER_BASIC_INFOS,
  FINANCIER_DETAILS,
} from '../fragments/FinancierFragment';

export const GET_FINANCIER = gql`
  query GetFinancier($id: ID!) {
    financier(id: $id) {
      ...FinancierDetailsFragment
    }
  }
  ${FINANCIER_DETAILS}
`;

export const GET_FINANCIERS = gql`
  query GetFinanciers(
    $financierFilter: FinancierFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    financiers(
      financierFilter: $financierFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...FinancierBasicInfosFragment
      }
    }
  }
  ${FINANCIER_BASIC_INFOS}
`;

// Add more financier-related queries here
