// PostFragment.js

import { gql } from '@apollo/client';

export const POST_MINI_INFOS = gql`
  fragment PostMiniInfosFragment on PostType {
    id
    image
    title
    content
    isActive
  }
`;

export const POST_BASIC_INFOS = gql`
  fragment PostBasicInfosFragment on PostType {
    ...PostMiniInfosFragment
  }
  ${POST_MINI_INFOS}
`;

export const POST_DETAILS = gql`
  fragment PostDetailsFragment on PostType {
    ...PostBasicInfosFragment
    files {
      id
      caption
      file
      createdAt
      updatedAt
    }
    description
    observation
  }
  ${POST_BASIC_INFOS}
`;


export const POST_RECAP = gql`
  fragment PostRecapDetailsFragment on PostType {
    ...PostBasicInfosFragment
    files {
      id
      caption
      file
      createdAt
      updatedAt
    }
    description
    observation
  }
  ${POST_BASIC_INFOS}
`;
