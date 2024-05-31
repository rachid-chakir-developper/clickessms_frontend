// VehicleFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const VEHICLE_BASIC_INFOS = gql`
  fragment VehicleBasicInfosFragment on VehicleType {
    id
    number
    name
    image
    registrationNumber
    vehicleBrand{
      id
      name
    }
    vehicleModel{
      id
      name
    }
    isActive
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${FOLDER_MINI_INFOS}
`;

export const VEHICLE_ESTABLISHMENT_DETAILS = gql`
  fragment VehicleEstablishmentFragment on VehicleEstablishmentType {
    id
    startingDate
    endingDate
    establishments{
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const VEHICLE_EMPLOYEE_DETAILS = gql`
  fragment VehicleEmployeeFragment on VehicleEmployeeType {
    id
    startingDate
    endingDate
    employees{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;


export const VEHICLE_OWNERSHIP_DETAILS = gql`
  fragment VehicleOwnershipFragment on VehicleOwnershipType {
    id
    ownershipType
    purchaseDate
    purchasePrice
    saleDate
    salePrice
    rentalStartingDate
    rentalEndingDate
    rentalPrice
    expectedMileage
  }
`;



export const VEHICLE_DETAILS = gql`
  fragment VehicleDetailsFragment on VehicleType {
    ...VehicleBasicInfosFragment
    state
    critAirVignette
    vehicleEstablishments{
      ...VehicleEstablishmentFragment
    }
    vehicleEmployees{
      ...VehicleEmployeeFragment
    }
    vehicleOwnerships{
      ...VehicleOwnershipFragment
    }
    description
    observation
  }
  ${VEHICLE_BASIC_INFOS}
  ${VEHICLE_ESTABLISHMENT_DETAILS}
  ${VEHICLE_EMPLOYEE_DETAILS}
  ${VEHICLE_OWNERSHIP_DETAILS}
`;
