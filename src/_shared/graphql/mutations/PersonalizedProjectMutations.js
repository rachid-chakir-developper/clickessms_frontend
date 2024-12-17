import { gql } from '@apollo/client';
import { PERSONALIZED_PROJECT_BASIC_INFOS } from '../fragments/PersonalizedProjectFragment';

export const POST_PERSONALIZED_PROJECT = gql`
  mutation CreatePersonalizedProject($personalizedProjectData: PersonalizedProjectInput!) {
    createPersonalizedProject(personalizedProjectData: $personalizedProjectData) {
      personalizedProject {
        ...PersonalizedProjectBasicInfosFragment
      }
    }
  }
  ${PERSONALIZED_PROJECT_BASIC_INFOS}
`;

export const PUT_PERSONALIZED_PROJECT = gql`
  mutation UpdatePersonalizedProject(
    $id: ID!
    $personalizedProjectData: PersonalizedProjectInput!
  ) {
    updatePersonalizedProject(id: $id, personalizedProjectData: $personalizedProjectData) {
      personalizedProject {
        ...PersonalizedProjectBasicInfosFragment
      }
    }
  }
  ${PERSONALIZED_PROJECT_BASIC_INFOS}
`;

export const PUT_PERSONALIZED_PROJECT_STATE = gql`
  mutation UpdatePersonalizedProjectState($id: ID!) {
    updatePersonalizedProjectState(id: $id) {
      done
      success
      message
      personalizedProject {
        ...PersonalizedProjectBasicInfosFragment
      }
    }
  }
  ${PERSONALIZED_PROJECT_BASIC_INFOS}
`;

export const DELETE_PERSONALIZED_PROJECT = gql`
  mutation DeletePersonalizedProject($id: ID!) {
    deletePersonalizedProject(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
