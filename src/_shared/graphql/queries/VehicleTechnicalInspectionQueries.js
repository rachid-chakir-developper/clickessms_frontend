import { gql } from '@apollo/client';
import {
  VEHICLE_TECH_INSPECTION_BASIC_INFOS,
  VEHICLE_TECH_INSPECTION_DETAILS,
  VEHICLE_TECH_INSPECTION_RECAP_DETAILS,
} from '../fragments/VehicleTechnicalInspectionFragment';

export const GET_VEHICLE_TECH_INSPECTION = gql`
  query GetVehicleTechnicalInspection($id: ID!) {
    vehicleTechnicalInspection(id: $id) {
      ...VehicleTechnicalInspectionDetailsFragment
    }
  }
  ${VEHICLE_TECH_INSPECTION_DETAILS}
`;

export const GET_VEHICLE_TECH_INSPECTIONS = gql`
  query GetVehicleTechnicalInspections(
    $vehicleTechnicalInspectionFilter: VehicleTechnicalInspectionFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    vehicleTechnicalInspections(
      vehicleTechnicalInspectionFilter: $vehicleTechnicalInspectionFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...VehicleTechnicalInspectionBasicInfosFragment
      }
    }
  }
  ${VEHICLE_TECH_INSPECTION_BASIC_INFOS}
`;

export const VEHICLE_TECH_INSPECTION_RECAP = gql`
  query GetVehicleTechnicalInspection($id: ID!) {
    vehicleTechnicalInspection(id: $id) {
      ...VehicleTechnicalInspectionRecapDetailsFragment
    }
  }
  ${VEHICLE_TECH_INSPECTION_RECAP_DETAILS}
`;
// Add more vehicleTechnicalInspection-related queries here
