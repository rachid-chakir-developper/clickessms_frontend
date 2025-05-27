import { gql } from '@apollo/client';
import {
  GOVERNANCE_MEMBER_BASIC_INFOS,
  GOVERNANCE_MEMBER_DETAILS,
} from '../fragments/GovernanceMemberFragment';

export const GET_GOVERNANCE_MEMBER = gql`
  query GetGovernanceMember($id: ID!) {
    governanceMember(id: $id) {
      ...GovernanceMemberDetailsFragment
    }
  }
  ${GOVERNANCE_MEMBER_DETAILS}
`;

export const GET_GOVERNANCE_MEMBERS = gql`
  query GetGovernanceMembers(
    $governanceMemberFilter: GovernanceMemberFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    governanceMembers(
      governanceMemberFilter: $governanceMemberFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...GovernanceMemberBasicInfosFragment
      }
    }
  }
  ${GOVERNANCE_MEMBER_BASIC_INFOS}
`;

// 🌳 Requête pour l'organigramme
export const GET_GOVERNANCE_ORGANIZATION = gql`
  query {
    governanceOrganization
  }
`;

// Add more governanceMember-related queries here
