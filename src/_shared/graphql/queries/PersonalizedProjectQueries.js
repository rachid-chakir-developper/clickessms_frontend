import { gql } from '@apollo/client';
import {
  PERSONALIZED_PROJECT_BASIC_INFOS,
  PERSONALIZED_PROJECT_DETAILS,
  PERSONALIZED_PROJECT_RECAP_DETAILS,
} from '../fragments/PersonalizedProjectFragment';

export const GET_PERSONALIZED_PROJECT = gql`
  query GetPersonalizedProject($id: ID!) {
    personalizedProject(id: $id) {
      ...PersonalizedProjectDetailsFragment
    }
  }
  ${PERSONALIZED_PROJECT_DETAILS}
`;

export const GET_PERSONALIZED_PROJECTS = gql`
  query GetPersonalizedProjects(
    $personalizedProjectFilter: PersonalizedProjectFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    personalizedProjects(
      personalizedProjectFilter: $personalizedProjectFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...PersonalizedProjectBasicInfosFragment
      }
    }
  }
  ${PERSONALIZED_PROJECT_BASIC_INFOS}
`;

export const GET_RECAP_PERSONALIZED_PROJECT = gql`
  query GetPersonalizedProject($id: ID!) {
    personalizedProject(id: $id) {
      ...PersonalizedProjectRecapDetailsFragment
    }
  }
  ${PERSONALIZED_PROJECT_RECAP_DETAILS}
`;