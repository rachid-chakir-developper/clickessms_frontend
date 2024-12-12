// SoftwareFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';

export const SOFTWARE_BASIC_INFOS = gql`
  fragment SoftwareBasicInfosFragment on SoftwareType {
    id
    number
    name
    image
    isBlocked
    isStockAuto
    designation
    quantity
    barCode
    buyingPriceHt
    tva
    description
    observation
    isActive
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${FOLDER_MINI_INFOS}
`;

export const SOFTWARE_DETAILS = gql`
  fragment SoftwareDetailsFragment on SoftwareType {
    ...SoftwareBasicInfosFragment
  }
  ${SOFTWARE_BASIC_INFOS}
`;


export const SOFTWARE_RECAP_DETAILS = gql`
  fragment SoftwareRecapDetailsFragment on SoftwareType {
    ...SoftwareBasicInfosFragment
    createdAt,
    updatedAt,
  }
  ${SOFTWARE_BASIC_INFOS}
`;
