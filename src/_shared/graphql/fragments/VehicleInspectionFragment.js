// VehicleInspectionFragment.js

import { gql } from '@apollo/client';
import { PARTNER_BASIC_INFOS } from './PartnerFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { VEHICLE_MINI_INFOS } from './VehicleFragment';
import { USER_BASIC_INFOS } from './UserFragment';

export const VEHICLE_INSPECTION_BASIC_INFOS = gql`
  fragment VehicleInspectionBasicInfosFragment on VehicleInspectionType {
    id
    number
    vehicle{
          ...VehicleMiniInfosFragment
      }
    inspectionDateTime
    nextInspectionDate
    controllerEmployees{
        ...EmployeeMiniInfosFragment
    }
    controllerPartner{
        ...PartnerBasicInfosFragment
    }
  }
  ${VEHICLE_MINI_INFOS}
  ${EMPLOYEE_MINI_INFOS}
  ${PARTNER_BASIC_INFOS}
`;

export const VEHICLE_INSPECTION_DETAILS = gql`
  fragment VehicleInspectionDetailsFragment on VehicleInspectionType {
    ...VehicleInspectionBasicInfosFragment
	mileage
	isRegistrationCardHere
	isInsuranceCertificateHere
	isInsuranceAttestationHere
  isTechnicalControlHere
	isOilLevelChecked
	isWindshieldWasherLevelChecked
	isBrakeFluidLevelChecked
	isCoolantLevelChecked
	isTirePressureChecked
	isLightsConditionChecked
	isBodyConditionChecked
    remarks
    images {
      id
      caption
      image
      createdAt
      updatedAt
      creator {
        ...UserBasicInfosFragment
      }
    }
    videos {
      id
      caption
      video
      thumbnail
      createdAt
      updatedAt
      creator {
        ...UserBasicInfosFragment
      }
    }
  }
  ${VEHICLE_INSPECTION_BASIC_INFOS}
  ${USER_BASIC_INFOS}
`;

export const VEHICLE_INSPECTION_RECAP_DETAILS = gql`
  fragment VehicleInspectionRecapDetailsFragment on VehicleInspectionType {
    ...VehicleInspectionBasicInfosFragment
	mileage
	isRegistrationCardHere
	isInsuranceCertificateHere
	isInsuranceAttestationHere
	isOilLevelChecked
	isWindshieldWasherLevelChecked
	isBrakeFluidLevelChecked
	isCoolantLevelChecked
	isTirePressureChecked
	isLightsConditionChecked
	isBodyConditionChecked
    remarks
    images {
      id
      caption
      image
      createdAt
      updatedAt
      creator {
        ...UserBasicInfosFragment
      }
    }
    videos {
      id
      caption
      video
      thumbnail
      createdAt
      updatedAt
      creator {
        ...UserBasicInfosFragment
      }
    }
  }
  ${VEHICLE_INSPECTION_BASIC_INFOS}
  ${USER_BASIC_INFOS}
`;