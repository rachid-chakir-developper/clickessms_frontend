// MaterialFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';

export const MATERIAL_BASIC_INFOS = gql`
  fragment MaterialBasicInfosFragment on MaterialType {
    id
    number
    name
    image
    isBlocked
    isStockAuto
    designation
    quantity
    isActive
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${FOLDER_MINI_INFOS}
`;

export const MATERIAL_DETAILS = gql`
  fragment MaterialDetailsFragment on MaterialType {
    ...MaterialBasicInfosFragment
    barCode
    buyingPriceHt
    tva
    description
    observation
  }
  ${MATERIAL_BASIC_INFOS}
`;
