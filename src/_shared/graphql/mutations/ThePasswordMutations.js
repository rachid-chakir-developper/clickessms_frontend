import { gql } from '@apollo/client';
import { THE_PASSWORD_BASIC_INFOS } from '../fragments/ThePasswordFragment';

export const POST_THE_PASSWORD = gql`
  mutation CreateThePassword($thePasswordData: ThePasswordInput!) {
    createThePassword(thePasswordData: $thePasswordData) {
      thePassword {
        ...ThePasswordBasicInfosFragment
      }
    }
  }
  ${THE_PASSWORD_BASIC_INFOS}
`;

export const PUT_THE_PASSWORD = gql`
  mutation UpdateThePassword(
    $id: ID!
    $thePasswordData: ThePasswordInput!
  ) {
    updateThePassword(id: $id, thePasswordData: $thePasswordData) {
      thePassword {
        ...ThePasswordBasicInfosFragment
      }
    }
  }
  ${THE_PASSWORD_BASIC_INFOS}
`;

export const PUT_THE_PASSWORD_STATE = gql`
  mutation UpdateThePasswordState($id: ID!) {
    updateThePasswordState(id: $id) {
      done
      success
      message
      thePassword {
        ...ThePasswordBasicInfosFragment
      }
    }
  }
  ${THE_PASSWORD_BASIC_INFOS}
`;

export const DELETE_THE_PASSWORD = gql`
  mutation DeleteThePassword($id: ID!) {
    deleteThePassword(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
