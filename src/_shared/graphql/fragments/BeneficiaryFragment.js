// BeneficiaryFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { FINANCIER_BASIC_INFOS } from './FinancierFragment';

export const BENEFICIARY_PHONE_INFOS = gql`
  fragment BeneficiaryPhoneInfosFragment on BeneficiaryType {
    id
    preferredName
    firstName
    lastName
    email
    mobile
    fix
    photo
    coverImage
    isActive
  }
`;

export const BENEFICIARY_MINI_INFOS = gql`
  fragment BeneficiaryMiniInfosFragment on BeneficiaryType {
    id
    gender{
      id
      name
    }
    preferredName
    firstName
    lastName
    email
    photo
    coverImage
    isActive
  }
`;
export const BENEFICIARY_ENTRY_DETAILS = gql`
  fragment BeneficiaryEntryFragment on BeneficiaryEntryType {
    id
    entryDate
    releaseDate
    establishments{
      ...EstablishmentMiniInfosFragment
    }
    internalReferents{
      ...EmployeeMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
  ${EMPLOYEE_MINI_INFOS}
`;

export const BENEFICIARY_BASIC_INFOS = gql`
  fragment BeneficiaryBasicInfosFragment on BeneficiaryType {
    ...BeneficiaryMiniInfosFragment
    birthDate
    beneficiaryEntries{
      ...BeneficiaryEntryFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${BENEFICIARY_MINI_INFOS}
  ${BENEFICIARY_ENTRY_DETAILS}
`;

export const BENEFICIARY_ADMISSION_DETAILS = gql`
  fragment BeneficiaryAdmissionDocumentFragment on BeneficiaryAdmissionDocumentType {
    id
    document
    admissionDocumentType{
      id
      name
    }
    financier{
      ...FinancierBasicInfosFragment
    }
    startingDate
    endingDate
  }
  ${FINANCIER_BASIC_INFOS}
`;


export const BENEFICIARY_DETAILS = gql`
  fragment BeneficiaryDetailsFragment on BeneficiaryType {
    ...BeneficiaryBasicInfosFragment
    admissionDate
    description
    latitude
    longitude
    country
    city
    zipCode
    address
    mobile
    fix
    fax
    webSite
    otherContacts
    iban
    bic
    bankName
    isActive
    observation
    beneficiaryAdmissionDocuments{
      ...BeneficiaryAdmissionDocumentFragment
    }
  }
  ${BENEFICIARY_BASIC_INFOS}
  ${BENEFICIARY_ADMISSION_DETAILS}
`;
export const BENEFICIARY_RECAP_DETAILS = gql`
  fragment BeneficiaryRecapDetailsFragment on BeneficiaryType {
    ...BeneficiaryBasicInfosFragment
    admissionDate
    description
    latitude
    longitude
    country
    city
    zipCode
    address
    mobile
    fix
    fax
    webSite
    otherContacts
    iban
    bic
    bankName
    isActive
    observation
    beneficiaryAdmissionDocuments{
      ...BeneficiaryAdmissionDocumentFragment
    }
    createdAt
    updatedAt
  }
  ${BENEFICIARY_BASIC_INFOS}
  ${BENEFICIARY_ADMISSION_DETAILS}
`;

