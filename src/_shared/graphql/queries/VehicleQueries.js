import { gql } from '@apollo/client';
import {
  VEHICLE_BASIC_INFOS,
  VEHICLE_DETAILS,
} from '../fragments/VehicleFragment';

export const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    vehicle(id: $id) {
      ...VehicleDetailsFragment
    }
  }
  ${VEHICLE_DETAILS}
`;

export const GET_VEHICLES = gql`
  query GetVehicles(
    $vehicleFilter: VehicleFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    vehicles(
      vehicleFilter: $vehicleFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...VehicleBasicInfosFragment
      }
    }
  }
  ${VEHICLE_BASIC_INFOS}
`;

// Add more vehicle-related queries here
