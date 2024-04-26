// CommentFragment.js

import { gql } from '@apollo/client';
import { USER_BASIC_INFOS } from './UserFragment';

export const COMMENT_BASIC_INFOS = gql`
  fragment CommentBasicInfosFragment on CommentType {
    id
    text
    image
    createdAt
    creator {
      ...UserBasicInfosFragment
    }
  }
  ${USER_BASIC_INFOS}
`;

export const COMMENT_DETAILS = gql`
  fragment CommentDetailsFragment on CommentType {
    ...CommentBasicInfosFragment
    upatedAt
  }
  ${COMMENT_BASIC_INFOS}
`;
