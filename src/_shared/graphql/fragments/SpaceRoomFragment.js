// SpaceRoomFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { FOLDER_MINI_INFOS } from './MediaFragment';

export const SPACE_ROOM_MINI_INFOS = gql`
  fragment SpaceRoomMiniInfosFragment on SpaceRoomType {
    id
    number
    name
    image
    roomType
    capacity
    isActive
  }
`;

export const SPACE_ROOM_BASIC_INFOS = gql`
  fragment SpaceRoomBasicInfosFragment on SpaceRoomType {
    ...SpaceRoomMiniInfosFragment
    establishment {
      ...EstablishmentMiniInfosFragment
    }
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${SPACE_ROOM_MINI_INFOS}
  ${ESTABLISHMENT_MINI_INFOS}
  ${FOLDER_MINI_INFOS}
`;

export const SPACE_ROOM_DETAILS = gql`
  fragment SpaceRoomDetailsFragment on SpaceRoomType {
    ...SpaceRoomBasicInfosFragment
    description
    observation
  }
  ${SPACE_ROOM_BASIC_INFOS}
`;


export const SPACE_ROOM_RECAP = gql`
  fragment SpaceRoomRecapDetailsFragment on SpaceRoomType {
    ...SpaceRoomBasicInfosFragment
    description
    observation
    createdAt
    updatedAt
  }
  ${SPACE_ROOM_BASIC_INFOS}
`;
