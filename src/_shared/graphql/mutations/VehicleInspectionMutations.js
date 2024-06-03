import { gql } from '@apollo/client';
import { VEHICLE_INSPECTION_BASIC_INFOS } from '../fragments/VehicleInspectionFragment';

export const POST_VEHICLE_INSPECTION = gql`
  mutation CreateVehicleInspection($vehicleInspectionData: VehicleInspectionInput!, $images : [MediaInput], $videos : [MediaInput]) {
    createVehicleInspection(vehicleInspectionData: $vehicleInspectionData, images : $images, videos : $videos) {
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
    $vehicleInspectionData: VehicleInspectionInput!, $images : [MediaInput], $videos : [MediaInput]
  ) {
    updateVehicleInspection(id: $id, vehicleInspectionData: $vehicleInspectionData, images : $images, videos : $videos) {
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
