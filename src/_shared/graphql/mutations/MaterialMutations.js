import { gql } from '@apollo/client';
import { MATERIAL_BASIC_INFOS } from '../fragments/MaterialFragment';

export const POST_MATERIAL = gql`
  mutation CreateMaterial($materialData: MaterialInput!, $image: Upload) {
    createMaterial(materialData: $materialData, image: $image) {
      material {
        ...MaterialBasicInfosFragment
      }
    }
  }
  ${MATERIAL_BASIC_INFOS}
`;

export const PUT_MATERIAL = gql`
  mutation UpdateMaterial(
    $id: ID!
    $materialData: MaterialInput!
    $image: Upload
  ) {
    updateMaterial(id: $id, materialData: $materialData, image: $image) {
      material {
        ...MaterialBasicInfosFragment
      }
    }
  }
  ${MATERIAL_BASIC_INFOS}
`;

export const PUT_MATERIAL_STATE = gql`
  mutation UpdateMaterialState($id: ID!) {
    updateMaterialState(id: $id) {
      done
      success
      message
      material {
        ...MaterialBasicInfosFragment
      }
    }
  }
  ${MATERIAL_BASIC_INFOS}
`;

export const DELETE_MATERIAL = gql`
  mutation DeleteMaterial($id: ID!) {
    deleteMaterial(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
