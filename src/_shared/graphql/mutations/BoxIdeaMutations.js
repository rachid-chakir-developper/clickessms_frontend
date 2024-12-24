import { gql } from '@apollo/client';
import { BOX_IDEA_BASIC_INFOS } from '../fragments/BoxIdeaFragment';

export const POST_BOX_IDEA = gql`
  mutation CreateBoxIdea($boxIdeaData: BoxIdeaInput!) {
    createBoxIdea(boxIdeaData: $boxIdeaData) {
      boxIdea {
        ...BoxIdeaBasicInfosFragment
      }
    }
  }
  ${BOX_IDEA_BASIC_INFOS}
`;

export const PUT_BOX_IDEA = gql`
  mutation UpdateBoxIdea(
    $id: ID!
    $boxIdeaData: BoxIdeaInput!
  ) {
    updateBoxIdea(id: $id, boxIdeaData: $boxIdeaData) {
      boxIdea {
        ...BoxIdeaBasicInfosFragment
      }
    }
  }
  ${BOX_IDEA_BASIC_INFOS}
`;

export const PUT_BOX_IDEA_STATE = gql`
  mutation UpdateBoxIdeaState($id: ID!) {
    updateBoxIdeaState(id: $id) {
      done
      success
      message
      boxIdea {
        ...BoxIdeaBasicInfosFragment
      }
    }
  }
  ${BOX_IDEA_BASIC_INFOS}
`;

export const DELETE_BOX_IDEA = gql`
  mutation DeleteBoxIdea($id: ID!) {
    deleteBoxIdea(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
