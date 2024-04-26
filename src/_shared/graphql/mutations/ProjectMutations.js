import { gql } from '@apollo/client';
import { PROJECT_BASIC_INFOS } from '../fragments/ProjectFragment';

// Requête pour créer un nouveau projet
export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $photo: Upload
    $owners: [Int]
    $managers: [Int]
    $projectData: ProjectInput!
  ) {
    createProject(
      photo: $photo
      owners: $owners
      managers: $managers
      projectData: $projectData
    ) {
      ...ProjectBasicInfosFragment
    }
  }
  ${PROJECT_BASIC_INFOS}
`;

// Requête pour mettre à jour les détails d'un projet
export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $photo: Upload
    $owners: [Int]
    $managers: [Int]
    $projectData: ProjectInput!
  ) {
    updateProject(
      id: $id
      photo: $photo
      owners: $owners
      managers: $managers
      projectData: $projectData
    ) {
      ...ProjectBasicInfosFragment
    }
  }
  ${PROJECT_BASIC_INFOS}
`;

// Requête pour supprimer un projet par ID
export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(id: $projectId) {
      id
      success
      deleted
      message
    }
  }
`;
