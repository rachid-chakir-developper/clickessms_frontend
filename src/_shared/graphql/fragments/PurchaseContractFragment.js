// PurchaseContractFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { FOLDER_MINI_INFOS } from './MediaFragment';

export const PURCHASE_CONTRACT_MINI_INFOS = gql`
  fragment PurchaseContractMiniInfosFragment on PurchaseContractType {
    id
    number
    name
    image
    roomType
    capacity
    isActive
  }
`;

export const PURCHASE_CONTRACT_BASIC_INFOS = gql`
  fragment PurchaseContractBasicInfosFragment on PurchaseContractType {
    ...PurchaseContractMiniInfosFragment
    establishment {
      ...EstablishmentMiniInfosFragment
    }
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${PURCHASE_CONTRACT_MINI_INFOS}
  ${ESTABLISHMENT_MINI_INFOS}
  ${FOLDER_MINI_INFOS}
`;

export const PURCHASE_CONTRACT_DETAILS = gql`
  fragment PurchaseContractDetailsFragment on PurchaseContractType {
    ...PurchaseContractBasicInfosFragment
    description
    observation
  }
  ${PURCHASE_CONTRACT_BASIC_INFOS}
`;


export const PURCHASE_CONTRACT_RECAP = gql`
  fragment PurchaseContractRecapDetailsFragment on PurchaseContractType {
    ...PurchaseContractBasicInfosFragment
    description
    observation
    createdAt
    updatedAt
  }
  ${PURCHASE_CONTRACT_BASIC_INFOS}
`;
