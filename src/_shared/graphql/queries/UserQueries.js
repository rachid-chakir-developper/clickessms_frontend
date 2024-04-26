import { gql } from '@apollo/client';
import { USER_BASIC_INFOS, USER_DETAILS } from '../fragments/UserFragment';

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserDetailsFragment
    }
  }
  ${USER_DETAILS}
`;

export const GET_USERS = gql`
  query GetUsers(
    $userFilter: UserFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    users(
      userFilter: $userFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...UserBasicInfosFragment
      }
    }
  }
  ${USER_BASIC_INFOS}
`;

export const GET_GROUPS = gql`
  query {
    groups {
      id
      name
      permissions {
        id
        name
      }
    }
  }
`;
export const GET_PERMISSIONS = gql`
  query {
    permissions {
      id
      name
    }
  }
`;
