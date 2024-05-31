import { gql } from '@apollo/client';
import { VEHICLE_INSPECTION_BASIC_INFOS } from '../fragments/VehicleInspectionFragment';

export const POST_VEHICLE_INSPECTION = gql`
  mutation CreateVehicleInspection($vehicleInspectionData: VehicleInspectionInput!) {
    createVehicleInspection(vehicleInspectionData: $vehicleInspectionData) {
      vehicleInspection {
        ...VehicleInspectionBasicInfosFragment
      }
    }
  }
  ${VEHICLE_INSPECTION_BASIC_INFOS}
`;

export const PUT_VEHICLE_INSPECTION = gql`
  mutation UpdateVehicleInspection(
    $id: ID!
    $vehicleInspectionData: VehicleInspectionInput!
  ) {
    updateVehicleInspection(id: $id, vehicleInspectionData: $vehicleInspectionData) {
      vehicleInspection {
        ...VehicleInspectionBasicInfosFragment
      }
    }
  }
  ${VEHICLE_INSPECTION_BASIC_INFOS}
`;

export const PUT_VEHICLE_INSPECTION_STATE = gql`
  mutation UpdateVehicleInspectionState($id: ID!) {
    updateVehicleInspectionState(id: $id) {
      done
      success
      message
      vehicleInspection {
        ...VehicleInspectionBasicInfosFragment
      }
    }
  }
  ${VEHICLE_INSPECTION_BASIC_INFOS}
`;

export const DELETE_VEHICLE_INSPECTION = gql`
  mutation DeleteVehicleInspection($id: ID!) {
    deleteVehicleInspection(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
