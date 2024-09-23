import { gql } from '@apollo/client';
import {
  SCE_MEMBER_BASIC_INFOS,
  SCE_MEMBER_DETAILS,
} from '../fragments/SceMemberFragment';

export const GET_SCE_MEMBER = gql`
  query GetSceMember($id: ID!) {
    sceMember(id: $id) {
      ...SceMemberDetailsFragment
    }
  }
  ${SCE_MEMBER_DETAILS}
`;

export const GET_SCE_MEMBERS = gql`
  query GetSceMembers(
    $sceMemberFilter: SceMemberFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    sceMembers(
      sceMemberFilter: $sceMemberFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...SceMemberBasicInfosFragment
      }
    }
  }
  ${SCE_MEMBER_BASIC_INFOS}
`;

// Add more sceMember-related queries here
