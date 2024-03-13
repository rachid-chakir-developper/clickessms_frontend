import { useQuery, useLazyQuery, useSubscription, useMutation } from "@apollo/client";
import {
  GET_PROJECTS,
  GET_PROJECT_DETAILS
} from "../../graphql/queries/ProjectQueries"; // Importez vos requêtes GraphQL depuis un autre fichier
import {
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT
} from "../../graphql/mutations/ProjectMutations"; // Importez vos requêtes GraphQL depuis un autre fichier
import {
  PROJECT_CREATED_SUBSCRIPTION,
  PROJECT_UPDATED_SUBSCRIPTION,
  PROJECT_DELETED_SUBSCRIPTION
} from "../../graphql/subscriptions/ProjectSubscriptions"; // Importez vos requêtes GraphQL depuis un autre fichier

// Fonction pour obtenir la liste des projets
export function useGetProjects() {
  return useQuery(GET_PROJECTS);
}

// Fonction pour obtenir les détails d'un projet en utilisant useLazyQuery
export function useGetProjectDetailsLazy() {
  return useLazyQuery(GET_PROJECT_DETAILS);
}

// Fonction pour créer un nouveau projet
export function useCreateProject() {
  return useMutation(CREATE_PROJECT);
}

// Fonction pour mettre à jour les détails d'un projet
export function useUpdateProject() {
  return useMutation(UPDATE_PROJECT);
}

// Fonction pour supprimer un projet
export function useDeleteProject() {
  return useMutation(DELETE_PROJECT);
}

// Fonction pour s'abonner aux nouveaux projets créés
export function useProjectCreatedSubscription() {
  return useSubscription(PROJECT_CREATED_SUBSCRIPTION);
}

// Fonction pour s'abonner aux mises à jour de projets existants
export function useProjectUpdatedSubscription() {
  return useSubscription(PROJECT_UPDATED_SUBSCRIPTION);
}

// Fonction pour s'abonner à la suppression de projets
export function useProjectDeletedSubscription() {
  return useSubscription(PROJECT_DELETED_SUBSCRIPTION);
}
