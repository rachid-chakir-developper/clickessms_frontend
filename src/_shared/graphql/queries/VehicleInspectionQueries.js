import { gql } from '@apollo/client';
import {
  VEHICLE_INSPECTION_BASIC_INFOS,
  VEHICLE_INSPECTION_DETAILS,
  VEHICLE_INSPECTION_RECAP_DETAILS,
} from '../fragments/VehicleInspectionFragment';

export const GET_VEHICLE_INSPECTION = gql`
  query GetVehicleInspection($id: ID!) {
    vehicleInspection(id: $id) {
      ...VehicleInspectionDetailsFragment
    }
  }
  ${VEHICLE_INSPECTION_DETAILS}
`;

export const GET_VEHICLE_INSPECTIONS = gql`
  query GetVehicleInspections(
    $vehicleInspectionFilter: VehicleInspectionFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    vehicleInspections(
      vehicleInspectionFilter: $vehicleInspectionFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...VehicleInspectionBasicInfosFragment
      }
    }
  }
  ${VEHICLE_INSPECTION_BASIC_INFOS}
`;

export const VEHICLE_INSPECTION_RECAP = gql`
  query GetVehicleInspection($id: ID!) {
    vehicleInspection(id: $id) {
      ...VehicleInspectionRecapDetailsFragment
    }
  }
  ${VEHICLE_INSPECTION_RECAP_DETAILS}
`;
// Add more vehicleInspection-related queries here
