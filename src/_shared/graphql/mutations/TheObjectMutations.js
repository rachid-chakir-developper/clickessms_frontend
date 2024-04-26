import { gql } from '@apollo/client';
import { THE_OBJECT_BASIC_INFOS } from '../fragments/TheObjectFragment';

export const POST_THE_OBJECT = gql`
  mutation CreateTheObject($theObjectData: TheObjectInput!, $image: Upload) {
    createTheObject(theObjectData: $theObjectData, image: $image) {
      theObject {
        ...TheObjectBasicInfosFragment
      }
    }
  }
  ${THE_OBJECT_BASIC_INFOS}
`;

export const PUT_THE_OBJECT = gql`
  mutation UpdateTheObject(
    $id: ID!
    $theObjectData: TheObjectInput!
    $image: Upload
  ) {
    updateTheObject(id: $id, theObjectData: $theObjectData, image: $image) {
      theObject {
        ...TheObjectBasicInfosFragment
      }
    }
  }
  ${THE_OBJECT_BASIC_INFOS}
`;

export const PUT_THE_OBJECT_STATE = gql`
  mutation UpdateTheObjectState($id: ID!) {
    updateTheObjectState(id: $id) {
      done
      success
      message
      theObject {
        ...TheObjectBasicInfosFragment
      }
    }
  }
  ${THE_OBJECT_BASIC_INFOS}
`;

export const DELETE_THE_OBJECT = gql`
  mutation DeleteTheObject($id: ID!) {
    deleteTheObject(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
