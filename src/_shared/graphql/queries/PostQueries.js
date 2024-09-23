import { gql } from '@apollo/client';
import {
  POST_BASIC_INFOS,
  POST_DETAILS,
  POST_RECAP,
} from '../fragments/PostFragment';

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      ...PostDetailsFragment
    }
  }
  ${POST_DETAILS}
`;

export const GET_POSTS = gql`
  query GetPosts(
    $postFilter: PostFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    posts(
      postFilter: $postFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...PostBasicInfosFragment
      }
    }
  }
  ${POST_BASIC_INFOS}
`;

export const GET_POST_RECAP = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      ...PostRecapDetailsFragment
    }
  }
  ${POST_RECAP}
`;

// Add mor
// Add more messageNotification-related queries here

// Add more post-related queries here
