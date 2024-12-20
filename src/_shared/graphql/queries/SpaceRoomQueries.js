import { gql } from '@apollo/client';
import {
  SPACE_ROOM_BASIC_INFOS,
  SPACE_ROOM_DETAILS,
  SPACE_ROOM_RECAP,
} from '../fragments/SpaceRoomFragment';

export const GET_SPACE_ROOM = gql`
  query GetSpaceRoom($id: ID!) {
    spaceRoom(id: $id) {
      ...SpaceRoomDetailsFragment
    }
  }
  ${SPACE_ROOM_DETAILS}
`;

export const GET_SPACE_ROOMS = gql`
  query GetSpaceRooms(
    $spaceRoomFilter: SpaceRoomFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    spaceRooms(
      spaceRoomFilter: $spaceRoomFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...SpaceRoomBasicInfosFragment
      }
    }
  }
  ${SPACE_ROOM_BASIC_INFOS}
`;

export const GET_SPACE_ROOM_RECAP = gql`
  query GetSpaceRoom($id: ID!) {
    spaceRoom(id: $id) {
      ...SpaceRoomRecapDetailsFragment
    }
  }
  ${SPACE_ROOM_RECAP}
`;

// Add mor
// Add more messageNotification-related queries here

// Add more spaceRoom-related queries here
