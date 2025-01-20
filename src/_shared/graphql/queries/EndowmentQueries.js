import { gql } from '@apollo/client';
import {
  ENDOWMENT_BASIC_INFOS,
  ENDOWMENT_DETAILS,
  ENDOWMENT_RECAP_DETAILS,
} from '../fragments/EndowmentFragment';

export const GET_ENDOWMENT = gql`
  query GetEndowment($id: ID!) {
    endowment(id: $id) {
      ...EndowmentDetailsFragment
    }
  }
  ${ENDOWMENT_DETAILS}
`;

export const GET_ENDOWMENTS = gql`
  query GetEndowments(
    $endowmentFilter: EndowmentFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    endowments(
      endowmentFilter: $endowmentFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...EndowmentBasicInfosFragment
      }
    }
  }
  ${ENDOWMENT_BASIC_INFOS}
`;

export const GET_RECAP_ENDOWMENT = gql`
  query GetEndowment($id: ID!) {
    endowment(id: $id) {
      ...EndowmentRecapDetailsFragment
    }
  }
  ${ENDOWMENT_RECAP_DETAILS}
`;