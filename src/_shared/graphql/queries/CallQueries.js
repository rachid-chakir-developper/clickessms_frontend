import { gql } from '@apollo/client';
import {
  CALL_BASIC_INFOS,
  CALL_DETAILS,
  CALL_RECAP_DETAILS,
} from '../fragments/CallFragment';

export const GET_CALL = gql`
  query GetCall($id: ID!) {
    call(id: $id) {
      ...CallDetailsFragment
    }
  }
  ${CALL_DETAILS}
`;

export const GET_CALLS = gql`
  query GetCalls(
    $callFilter: CallFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    calls(
      callFilter: $callFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CallBasicInfosFragment
      }
    }
  }
  ${CALL_BASIC_INFOS}
`;

export const CALL_RECAP = gql`
  query GetCall($id: ID!) {
    call(id: $id) {
      ...CallRecapDetailsFragment
    }
  }
  ${CALL_RECAP_DETAILS}
`;
// Add more call-related queries here
