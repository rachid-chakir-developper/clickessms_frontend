import { gql } from '@apollo/client';
import { VEHICLE_REPAIR_BASIC_INFOS } from '../fragments/VehicleRepairFragment';

export const POST_VEHICLE_REPAIR = gql`
  mutation CreateVehicleRepair(
    $vehicleRepairData: VehicleRepairInput!
    $document: Upload
  ) {
    createVehicleRepair(vehicleRepairData: $vehicleRepairData, document: $document) {
      vehicleRepair {
        ...VehicleRepairBasicInfosFragment
      }
    }
  }
  ${VEHICLE_REPAIR_BASIC_INFOS}
`;

export const PUT_VEHICLE_REPAIR = gql`
  mutation UpdateVehicleRepair(
    $id: ID!
    $vehicleRepairData: VehicleRepairInput!
    $document: Upload
  ) {
    updateVehicleRepair(
      id: $id
      vehicleRepairData: $vehicleRepairData
      document: $document
    ) {
      vehicleRepair {
        ...VehicleRepairBasicInfosFragment
      }
    }
  }
  ${VEHICLE_REPAIR_BASIC_INFOS}
`;

export const DELETE_VEHICLE_REPAIR = gql`
  mutation DeleteVehicleRepair($id: ID!) {
    deleteVehicleRepair(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
