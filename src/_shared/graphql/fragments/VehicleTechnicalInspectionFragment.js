// VehicleTechnicalInspectionFragment.js

import { gql } from '@apollo/client';
import { VEHICLE_MINI_INFOS } from './VehicleFragment';

export const VEHICLE_INSPECTION_FAILURE_DETAILS = gql`
  fragment VehicleInspectionFailureFragment on VehicleInspectionFailureType {
    id
    failureType
    description
  }
`;

export const VEHICLE_TECH_INSPECTION_BASIC_INFOS = gql`
  fragment VehicleTechnicalInspectionBasicInfosFragment on VehicleTechnicalInspectionType {
    id
    number
    document
    vehicle{
          ...VehicleMiniInfosFragment
      }
    inspectionDateTime
    nextInspectionDate
    state
    observation
    failures{
      ...VehicleInspectionFailureFragment
    }
  }
  ${VEHICLE_MINI_INFOS}
  ${VEHICLE_INSPECTION_FAILURE_DETAILS}
`;


export const VEHICLE_TECH_INSPECTION_DETAILS = gql`
  fragment VehicleTechnicalInspectionDetailsFragment on VehicleTechnicalInspectionType {
    ...VehicleTechnicalInspectionBasicInfosFragment
  }
  ${VEHICLE_TECH_INSPECTION_BASIC_INFOS}
`;

export const VEHICLE_TECH_INSPECTION_RECAP_DETAILS = gql`
  fragment VehicleTechnicalInspectionRecapDetailsFragment on VehicleTechnicalInspectionType {
    ...VehicleTechnicalInspectionBasicInfosFragment
    observation
    failures{
      ...VehicleInspectionFailureFragment
    }
    createdAt
    updatedAt
  }
  ${VEHICLE_TECH_INSPECTION_BASIC_INFOS}
  ${VEHICLE_INSPECTION_FAILURE_DETAILS}
`;