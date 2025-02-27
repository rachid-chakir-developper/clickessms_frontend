// DashboardCommentFragment.js

import { gql } from '@apollo/client';
import { USER_BASIC_INFOS } from './UserFragment';

export const DASHBOARD_COMMENT_BASIC_INFOS = gql`
  fragment DashboardCommentBasicInfosFragment on DashboardCommentType {
    id
    text
    commentType
    year
    month
  }
`;

export const DASHBOARD_COMMENT_DETAILS = gql`
  fragment DashboardCommentDetailsFragment on DashboardCommentType {
    ...DashboardCommentBasicInfosFragment
    creator {
      ...UserBasicInfosFragment
    }
    createdAt
    updatedAt
  }
  ${DASHBOARD_COMMENT_BASIC_INFOS}
  ${USER_BASIC_INFOS}
`;
