import { gql } from '@apollo/client';
import { GOVERNANCE_MEMBER_BASIC_INFOS } from '../fragments/GovernanceMemberFragment';

export const POST_GOVERNANCE_MEMBER = gql`
  mutation CreateGovernanceMember(
    $governanceMemberData: GovernanceMemberInput!
    $photo: Upload
    $coverImage: Upload
  ) {
    createGovernanceMember(
      governanceMemberData: $governanceMemberData
      photo: $photo
      coverImage: $coverImage
    ) {
      governanceMember {
        ...GovernanceMemberBasicInfosFragment
      }
    }
  }
  ${GOVERNANCE_MEMBER_BASIC_INFOS}
`;

export const PUT_GOVERNANCE_MEMBER = gql`
  mutation UpdateGovernanceMember(
    $id: ID!
    $governanceMemberData: GovernanceMemberInput!
    $photo: Upload
    $coverImage: Upload
  ) {
    updateGovernanceMember(
      id: $id
      governanceMemberData: $governanceMemberData
      photo: $photo
      coverImage: $coverImage
    ) {
      governanceMember {
        ...GovernanceMemberBasicInfosFragment
      }
    }
  }
  ${GOVERNANCE_MEMBER_BASIC_INFOS}
`;

export const PUT_GOVERNANCE_MEMBER_STATE = gql`
  mutation UpdateGovernanceMemberState($id: ID!) {
    updateGovernanceMemberState(id: $id) {
      done
      success
      message
      governanceMember {
        ...GovernanceMemberBasicInfosFragment
      }
    }
  }
  ${GOVERNANCE_MEMBER_BASIC_INFOS}
`;

export const DELETE_GOVERNANCE_MEMBER = gql`
  mutation DeleteGovernanceMember($id: ID!) {
    deleteGovernanceMember(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
