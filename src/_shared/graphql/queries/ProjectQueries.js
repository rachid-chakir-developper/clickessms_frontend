import { gql } from "@apollo/client";
import { PROJECT_BASIC_INFOS, PROJECT_DETAILS } from "../fragments/ProjectFragment";

// Requête pour obtenir la liste des projets
export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      ...ProjectBasicInfosFragment
    }
  }
  ${PROJECT_BASIC_INFOS}
`;

// Requête pour obtenir les détails d'un projet par ID
export const GET_PROJECT_DETAILS = gql`
  query GetProjectDetails($projectId: ID!) {
    project(id: $projectId) {
      ...ProjectDetailsFragment
    }
  }
  ${PROJECT_DETAILS}
`;