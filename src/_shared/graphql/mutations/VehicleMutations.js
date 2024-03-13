import { gql } from '@apollo/client';
import { VEHICLE_BASIC_INFOS } from '../fragments/VehicleFragment';

export const POST_VEHICLE = gql`
  mutation CreateVehicle($vehicleData: VehicleInput!, $image : Upload) {
    createVehicle(vehicleData: $vehicleData, image : $image) {
      vehicle{
        ...VehicleBasicInfosFragment
      }
    }
  }
  ${VEHICLE_BASIC_INFOS}
`;

export const PUT_VEHICLE = gql`
  mutation UpdateVehicle($id: ID!, $vehicleData: VehicleInput!, $image : Upload) {
    updateVehicle(id: $id, vehicleData: $vehicleData, image : $image) {
      vehicle{
        ...VehicleBasicInfosFragment
      }
    }
  }
  ${VEHICLE_BASIC_INFOS}
`;

export const PUT_VEHICLE_STATE = gql`
  mutation UpdateVehicleState($id: ID!) {
    updateVehicleState(id: $id){
      done
      success
      message
      vehicle{
        ...VehicleBasicInfosFragment
      }
    }
  }
  ${VEHICLE_BASIC_INFOS}
`;

export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id){
      id
      success
      deleted
      message
    }
  }
`;