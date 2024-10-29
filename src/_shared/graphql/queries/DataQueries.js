import { gql } from '@apollo/client';
import { DATA_BASIC_INFOS } from '../fragments/DataFragment';

export const GET_DATAS = gql`
  query ($typeData: String!) {
    datas(typeData: $typeData) {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_ESTABLISHMENT = gql`
  query {
    establishmentTypes: datas(typeData: "EstablishmentType") {
      ...DataBasicInfosFragment
    }
    establishmentCategories: datas(typeData: "EstablishmentCategory") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_BENEFICIARY = gql`
  query {
    humanGenders: datas(typeData: "HumanGender") {
      ...DataBasicInfosFragment
    }
    admissionDocumentTypes: datas(typeData: "AdmissionDocumentType") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_BENEFICIARY_ABSENCE = gql`
  query {
    absenceReasons: datas(typeData: "AbsenceReason") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_EMPLOYEE_ABSENCE = gql`
  query {
    absenceReasons: datas(typeData: "AbsenceReason") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_UNDESIRABLE_EVENT = gql`
  query {
    undesirableEventNormalTypes: datas(typeData: "UndesirableEventNormalType") {
      ...DataBasicInfosFragment
    }
    undesirableEventSeriousTypes: datas(
      typeData: "UndesirableEventSeriousType"
    ) {
      ...DataBasicInfosFragment
    }
    frequencies: datas(typeData: "UndesirableEventFrequency") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_MEETING = gql`
  query {
    meetingTypes: datas(typeData: "TypeMeeting") {
      ...DataBasicInfosFragment
    }
    meetingReasons: datas(typeData: "MeetingReason") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;


export const GET_DATAS_VEHICLE = gql`
  query {
    vehicleBrands: datas(typeData: "VehicleBrand") {
      ...DataBasicInfosFragment
    }
    vehicleModels: datas(typeData: "VehicleModel") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;


export const GET_DATAS_FRAME_DOCUMENT_ = gql`
  query {
    documentTypes: datas(typeData: "DocumentType") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;


export const GET_DATAS_EMPLOYEE_CONTRACT = gql`
  query {
    employeeMissions: datas(typeData: "EmployeeMission") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;
