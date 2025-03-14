// BeneficiaryAdmissionFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';
import { FINANCIER_BASIC_INFOS } from './FinancierFragment';

export const BENEFICIARY_ADMISSION_MINI_INFOS = gql`
  fragment BeneficiaryAdmissionMiniInfosFragment on BeneficiaryAdmissionType {
    id
    number
    preAdmissionDate
    receptionDate
    gender
    preferredName
    firstName
    lastName
    email
    birthDate
    status
    responseDate
    statusReason
    financier{
      ...FinancierBasicInfosFragment
    }
  }
  ${FINANCIER_BASIC_INFOS}
`;

export const BENEFICIARY_ADMISSION_BASIC_INFOS = gql`
  fragment BeneficiaryAdmissionBasicInfosFragment on BeneficiaryAdmissionType {
    ...BeneficiaryAdmissionMiniInfosFragment
    birthCity
    birthCountry
    nationality
    age
    professionalStatus{
      id
      name
    }
    establishments{
      ...EstablishmentMiniInfosFragment
    }
    employee {
      ...EmployeeBasicInfosFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${BENEFICIARY_ADMISSION_MINI_INFOS}
  ${ESTABLISHMENT_MINI_INFOS}
  ${EMPLOYEE_BASIC_INFOS}
`;



export const BENEFICIARY_ADMISSION_DETAILS = gql`
  fragment BeneficiaryAdmissionDetailsFragment on BeneficiaryAdmissionType {
    ...BeneficiaryAdmissionBasicInfosFragment
    latitude
    longitude
    country
    city
    zipCode
    address
    additionalAddress
    mobile
    fix
    fax
    webSite
    otherContacts
    description
    observation
    files {
      id
      caption
      file
      createdAt
      updatedAt
    }
  }
  ${BENEFICIARY_ADMISSION_BASIC_INFOS}
`;

export const BENEFICIARY_ADMISSION_RECAP = gql`
  fragment BeneficiaryAdmissionRecapFragment on BeneficiaryAdmissionType {
    ...BeneficiaryAdmissionBasicInfosFragment
    latitude
    longitude
    country
    city
    zipCode
    address
    additionalAddress
    mobile
    fix
    fax
    webSite
    otherContacts
    description
    observation
    createdAt
    updatedAt 
  }
  ${BENEFICIARY_ADMISSION_BASIC_INFOS}
`;
