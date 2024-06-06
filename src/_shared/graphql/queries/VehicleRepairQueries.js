import { gql } from '@apollo/client';
import {
  VEHICLE_REPAIR_BASIC_INFOS,
  VEHICLE_REPAIR_DETAILS,
  VEHICLE_REPAIR_RECAP_DETAILS,
} from '../fragments/VehicleRepairFragment';

export const GET_VEHICLE_REPAIR = gql`
  query GetVehicleRepair($id: ID!) {
    vehicleRepair(id: $id) {
      ...VehicleRepairDetailsFragment
    }
  }
  ${VEHICLE_REPAIR_DETAILS}
`;

export const GET_VEHICLE_REPAIRS = gql`
  query GetVehicleRepairs(
    $vehicleRepairFilter: VehicleRepairFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    vehicleRepairs(
      vehicleRepairFilter: $vehicleRepairFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...VehicleRepairBasicInfosFragment
      }
    }
  }
  ${VEHICLE_REPAIR_BASIC_INFOS}
`;

export const VEHICLE_REPAIR_RECAP = gql`
  query GetVehicleRepair($id: ID!) {
    vehicleRepair(id: $id) {
      ...VehicleRepairRecapDetailsFragment
    }
  }
  ${VEHICLE_REPAIR_RECAP_DETAILS}
`;
// Add more vehicleRepair-related queries here
