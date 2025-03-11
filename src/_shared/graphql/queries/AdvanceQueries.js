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
      totalCount
      nodes {
        ...AdvanceBasicInfosFragment
      }
    }
  }
  ${ADVANCE_BASIC_INFOS}
`; 