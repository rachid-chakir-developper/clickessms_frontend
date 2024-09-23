import { gql } from '@apollo/client';
import { SCE_MEMBER_BASIC_INFOS } from '../fragments/SceMemberFragment';

export const POST_SCE_MEMBER = gql`
  mutation CreateSceMember(
    $sceMemberData: SceMemberInput!
  ) {
    createSceMember(
      sceMemberData: $sceMemberData
    ) {
      sceMember {
        ...SceMemberBasicInfosFragment
      }
    }
  }
  ${SCE_MEMBER_BASIC_INFOS}
`;

export const PUT_SCE_MEMBER = gql`
  mutation UpdateSceMember(
    $id: ID!
    $sceMemberData: SceMemberInput!
  ) {
    updateSceMember(
      id: $id
      sceMemberData: $sceMemberData
    ) {
      sceMember {
        ...SceMemberBasicInfosFragment
      }
    }
  }
  ${SCE_MEMBER_BASIC_INFOS}
`;

export const PUT_SCE_MEMBER_STATE = gql`
  mutation UpdateSceMemberState($id: ID!) {
    updateSceMemberState(id: $id) {
      done
      success
      message
      sceMember {
        ...SceMemberBasicInfosFragment
      }
    }
  }
  ${SCE_MEMBER_BASIC_INFOS}
`;

export const DELETE_SCE_MEMBER = gql`
  mutation DeleteSceMember($id: ID!) {
    deleteSceMember(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
