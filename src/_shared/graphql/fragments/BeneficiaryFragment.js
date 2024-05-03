// BeneficiaryFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

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

export const BENEFICIARY_BASIC_INFOS = gql`
  fragment BeneficiaryBasicInfosFragment on BeneficiaryType {
    ...BeneficiaryMiniInfosFragment
    folder {
      id
      number
      name
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const BENEFICIARY_ADMISSION_DETAILS = gql`
  fragment BeneficiaryAdmissionDocumentFragment on BeneficiaryAdmissionDocumentType {
    id
    document
    admissionDocumentType{
      id
      name
    }
    startingDate
    endingDate
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

export const BENEFICIARY_DETAILS = gql`
  fragment BeneficiaryDetailsFragment on BeneficiaryType {
    ...BeneficiaryBasicInfosFragment
    birthDate
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
    beneficiaryEntries{
      ...BeneficiaryEntryFragment
    }
  }
  ${BENEFICIARY_BASIC_INFOS}
  ${BENEFICIARY_ADMISSION_DETAILS}
  ${BENEFICIARY_ENTRY_DETAILS}
`;
