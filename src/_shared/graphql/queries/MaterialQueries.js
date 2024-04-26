import { gql } from '@apollo/client';
import {
  MATERIAL_BASIC_INFOS,
  MATERIAL_DETAILS,
} from '../fragments/MaterialFragment';

export const GET_MATERIAL = gql`
  query GetMaterial($id: ID!) {
    material(id: $id) {
      ...MaterialDetailsFragment
    }
  }
  ${MATERIAL_DETAILS}
`;

export const GET_MATERIALS = gql`
  query GetMaterials(
    $materialFilter: MaterialFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    materials(
      materialFilter: $materialFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...MaterialBasicInfosFragment
      }
    }
  }
  ${MATERIAL_BASIC_INFOS}
`;

// Add more material-related queries here
