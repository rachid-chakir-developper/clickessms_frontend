import { gql } from '@apollo/client';
import { VEHICLE_TECH_INSPECTION_BASIC_INFOS } from '../fragments/VehicleTechnicalInspectionFragment';

export const POST_VEHICLE_TECH_INSPECTION = gql`
  mutation CreateVehicleTechnicalInspection(
    $vehicleTechnicalInspectionData: VehicleTechnicalInspectionInput!
    $document: Upload
  ) {
    createVehicleTechnicalInspection(vehicleTechnicalInspectionData: $vehicleTechnicalInspectionData, document: $document) {
      vehicleTechnicalInspection {
        ...VehicleTechnicalInspectionBasicInfosFragment
      }
    }
  }
  ${VEHICLE_TECH_INSPECTION_BASIC_INFOS}
`;

export const PUT_VEHICLE_TECH_INSPECTION = gql`
  mutation UpdateVehicleTechnicalInspection(
    $id: ID!
    $vehicleTechnicalInspectionData: VehicleTechnicalInspectionInput!
    $document: Upload
  ) {
    updateVehicleTechnicalInspection(
      id: $id
      vehicleTechnicalInspectionData: $vehicleTechnicalInspectionData
      document: $document
    ) {
      vehicleTechnicalInspection {
        ...VehicleTechnicalInspectionBasicInfosFragment
      }
    }
  }
  ${VEHICLE_TECH_INSPECTION_BASIC_INFOS}
`;

export const DELETE_VEHICLE_TECH_INSPECTION = gql`
  mutation DeleteVehicleTechnicalInspection($id: ID!) {
    deleteVehicleTechnicalInspection(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
