// VehicleFragment.js

import { gql } from '@apollo/client';
import { USER_BASIC_INFOS } from './UserFragment';
import { FOLDER_MINI_INFOS } from './MediaFragment';

export const VEHICLE_BASIC_INFOS = gql`
  fragment VehicleBasicInfosFragment on VehicleType {
    id
    number
    name
    image
    registrationNumber
    isInService
    isOutOfOrder
    isRented
    isBought
    designation
    isActive
    driver {
      ...UserBasicInfosFragment
    }
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${USER_BASIC_INFOS}
  ${FOLDER_MINI_INFOS}
`;

export const VEHICLE_DETAILS = gql`
  fragment VehicleDetailsFragment on VehicleType {
    ...VehicleBasicInfosFragment
    driverName
    driverNumber
    buyingPrice
    rentalPrice
    advancePaid
    purchaseDate
    rentalDate
    description
    observation
  }
  ${VEHICLE_BASIC_INFOS}
`;
