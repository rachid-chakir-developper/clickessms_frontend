import { gql } from '@apollo/client';
import { SPACE_ROOM_BASIC_INFOS } from '../fragments/SpaceRoomFragment';

export const POST_SPACE_ROOM = gql`
  mutation CreateSpaceRoom(
    $spaceRoomData: SpaceRoomInput!, $image: Upload
  ) {
    createSpaceRoom(
      spaceRoomData: $spaceRoomData, image: $image
    ) {
      spaceRoom {
        ...SpaceRoomBasicInfosFragment
      }
    }
  }
  ${SPACE_ROOM_BASIC_INFOS}
`;

export const PUT_SPACE_ROOM = gql`
  mutation UpdateSpaceRoom(
    $id: ID!
    $spaceRoomData: SpaceRoomInput!, $image: Upload
  ) {
    updateSpaceRoom(
      id: $id
      spaceRoomData: $spaceRoomData, image: $image
    ) {
      spaceRoom {
        ...SpaceRoomBasicInfosFragment
      }
    }
  }
  ${SPACE_ROOM_BASIC_INFOS}
`;

export const PUT_SPACE_ROOM_STATE = gql`
  mutation UpdateSpaceRoomState($id: ID!) {
    updateSpaceRoomState(id: $id) {
      done
      success
      message
      spaceRoom {
        ...SpaceRoomBasicInfosFragment
      }
    }
  }
  ${SPACE_ROOM_BASIC_INFOS}
`;

export const DELETE_SPACE_ROOM = gql`
  mutation DeleteSpaceRoom($id: ID!) {
    deleteSpaceRoom(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
