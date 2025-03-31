import { gql } from '@apollo/client';
import {
  ADVANCE_BASIC_INFOS,
  ADVANCE_DETAILS,
} from '../fragments/AdvanceFragment';

export const GET_ADVANCE = gql`
  query GetAdvance($id: ID!) {
    advance(id: $id) {
      ...AdvanceDetailsFragment
    }
  }
  ${ADVANCE_DETAILS}
`;

export const GET_ADVANCES = gql`
  query GetAdvances(
    $advanceFilter: AdvanceFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    advances(
      advanceFilter: $advanceFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      nodes {
        id
        number
        amount
        month
        status
        reason
        createdAt
        employee {
          id
          firstName
          lastName
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;