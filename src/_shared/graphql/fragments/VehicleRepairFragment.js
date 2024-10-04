// VehicleRepairFragment.js

import { gql } from '@apollo/client';
import { VEHICLE_MINI_INFOS } from './VehicleFragment';
import { PARTNER_BASIC_INFOS } from './PartnerFragment';


export const VEHICLE_CARRIED_OUT_REPAIR_DETAILS = gql`
  fragment VehicleTheCarriedOutRepairFragment on VehicleTheCarriedOutRepairType {
    id
    description
  }
`;
export const VEHICLE_REPAIR_VIGILANT_POINT_DETAILS = gql`
  fragment VehicleRepairVigilantPointFragment on VehicleRepairVigilantPointType {
    id
    description
  }
`;

export const VEHICLE_REPAIR_BASIC_INFOS = gql`
  fragment VehicleRepairBasicInfosFragment on VehicleRepairType {
    id
    number
    label
    document
    vehicle{
          ...VehicleMiniInfosFragment
      }
    repairDateTime
    totalAmount
    state
    garagePartner{
        ...PartnerBasicInfosFragment
    }
    report
    description
    observation
    repairs{
      ...VehicleTheCarriedOutRepairFragment
    }
    vigilantPoints{
      ...VehicleRepairVigilantPointFragment
    }
  }
  ${VEHICLE_MINI_INFOS}
  ${PARTNER_BASIC_INFOS}
  ${VEHICLE_CARRIED_OUT_REPAIR_DETAILS}
  ${VEHICLE_REPAIR_VIGILANT_POINT_DETAILS}
`;


export const VEHICLE_REPAIR_DETAILS = gql`
  fragment VehicleRepairDetailsFragment on VehicleRepairType {
    ...VehicleRepairBasicInfosFragment
  }
  ${VEHICLE_REPAIR_BASIC_INFOS}
`;

export const VEHICLE_REPAIR_RECAP_DETAILS = gql`
  fragment VehicleRepairRecapDetailsFragment on VehicleRepairType {
    ...VehicleRepairBasicInfosFragment
    report
    description
    observation
    repairs{
      ...VehicleTheCarriedOutRepairFragment
    }
    vigilantPoints{
      ...VehicleRepairVigilantPointFragment
    }
    createdAt
    updatedAt
  }
  ${VEHICLE_REPAIR_BASIC_INFOS}
  ${VEHICLE_CARRIED_OUT_REPAIR_DETAILS}
  ${VEHICLE_REPAIR_VIGILANT_POINT_DETAILS}
`;