import { gql } from '@apollo/client';
import {
  BOX_IDEA_BASIC_INFOS,
  BOX_IDEA_DETAILS,
  BOX_IDEA_RECAP_DETAILS,
} from '../fragments/BoxIdeaFragment';

export const GET_BOX_IDEA = gql`
  query GetBoxIdea($id: ID!) {
    boxIdea(id: $id) {
      ...BoxIdeaDetailsFragment
    }
  }
  ${BOX_IDEA_DETAILS}
`;

export const GET_BOX_IDEAS = gql`
  query GetBoxIdeas(
    $boxIdeaFilter: BoxIdeaFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    boxIdeas(
      boxIdeaFilter: $boxIdeaFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...BoxIdeaBasicInfosFragment
      }
    }
  }
  ${BOX_IDEA_BASIC_INFOS}
`;

export const GET_RECAP_BOX_IDEA = gql`
  query GetBoxIdea($id: ID!) {
    boxIdea(id: $id) {
      ...BoxIdeaRecapDetailsFragment
    }
  }
  ${BOX_IDEA_RECAP_DETAILS}
`;