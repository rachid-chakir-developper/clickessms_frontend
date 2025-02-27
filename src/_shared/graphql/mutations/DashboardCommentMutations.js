import { gql } from '@apollo/client';
import { DASHBOARD_COMMENT_BASIC_INFOS } from '../fragments/DashboardCommentFragment';

export const POST_DASHBOARD_COMMENT = gql`
  mutation CreateDashboardComment(
    $dashboardCommentData: DashboardCommentInput!
  ) {
    createDashboardComment(
      dashboardCommentData: $dashboardCommentData
    ) {
      dashboardComment {
        ...DashboardCommentBasicInfosFragment
      }
    }
  }
  ${DASHBOARD_COMMENT_BASIC_INFOS}
`;

export const PUT_DASHBOARD_COMMENT = gql`
  mutation UpdateDashboardComment(
    $id: ID!
    $dashboardCommentData: DashboardCommentInput!
  ) {
    updateDashboardComment(id: $id, dashboardCommentData: $dashboardCommentData) {
      dashboardComment {
        ...DashboardCommentBasicInfosFragment
      }
    }
  }
  ${DASHBOARD_COMMENT_BASIC_INFOS}
`;

export const DELETE_DASHBOARD_COMMENT = gql`
  mutation DeleteDashboardComment($id: ID!) {
    deleteDashboardComment(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
