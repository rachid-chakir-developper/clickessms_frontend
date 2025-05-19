import { gql } from '@apollo/client';
import { ACCOUNTING_NATURE_BASIC_INFOS, ACCOUNTING_NATURE_MINI_INFOS, DATA_BASIC_INFOS } from '../fragments/DataFragment';

export const GET_DATAS = gql`
  query ($typeData: String!, $idParent: ID) {
    datas(typeData: $typeData, idParent: $idParent) {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;


export const GET_ACCOUNTING_NATURES = gql`
  query GetAccountingNatures(
    $accountingNatureFilter: AccountingNatureFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    accountingNatures(
      accountingNatureFilter: $accountingNatureFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...AccountingNatureBasicInfosFragment
      }
    }
  }
  ${ACCOUNTING_NATURE_BASIC_INFOS}
`;

export const GET_ALL_ACCOUNTING_NATURES = gql`
  query GetAccountingNatures(
    $accountingNatureFilter: AccountingNatureFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    accountingNatures(
      accountingNatureFilter: $accountingNatureFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...AccountingNatureMiniInfosFragment
      }
    }
  }
  ${ACCOUNTING_NATURE_MINI_INFOS}
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
    admissionDocumentTypes: datas(typeData: "AdmissionDocumentType") {
      ...DataBasicInfosFragment
    }
    beneficiaryStatuses: datas(typeData: "BeneficiaryStatus") {
      ...DataBasicInfosFragment
    }
    endowmentTypes: datas(typeData: "TypeEndowment") {
      ...DataBasicInfosFragment
    }
    professionalStatuses: datas(typeData: "ProfessionalStatus") {
      ...DataBasicInfosFragment
    }
    beneficiaryDocumentTypes: datas(typeData: "BeneficiaryDocumentType") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_BENEFICIARY_DCOUMENT = gql`
  query {
    beneficiaryDocumentTypes: datas(typeData: "BeneficiaryDocumentType") {
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

export const GET_DATAS_VALIDATION_WORKFLOW = gql`
  query {
    employeePositions: datas(typeData: "EmployeePosition") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_EXPENSE = gql`
  query {
    accountingNatures: datas(typeData: "AccountingNature") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_ENDOWMENT = gql`
  query {
    endowmentTypes: datas(typeData: "TypeEndowment") {
      ...DataBasicInfosFragment
    }
    professionalStatuses: datas(typeData: "ProfessionalStatus") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_BENEFICIARY_EXPENSE = gql`
  query {
    endowmentTypes: datas(typeData: "TypeEndowment") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_ENDOWMENT_PAYMENT = gql`
  query {
    endowmentTypes: datas(typeData: "TypeEndowment") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_JOB = gql`
  query {
    jobPlatforms: datas(typeData: "JobPlatform") {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const GET_DATAS_JOB_CANDIDATE_INFORMATION_SHEET = gql`
  query($idCompany: ID) {
    jobCandidateDocumentTypes: datas(typeData: "JobCandidateDocumentType", idCompany: $idCompany) {
      ...DataBasicInfosFragment
    }
  }
  ${DATA_BASIC_INFOS}
`;

