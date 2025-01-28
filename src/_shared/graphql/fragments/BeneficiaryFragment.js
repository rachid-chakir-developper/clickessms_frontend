// BeneficiaryFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { FINANCIER_BASIC_INFOS } from './FinancierFragment';
import { CUSTOM_FIELD_VALUE_DETAILS } from './CustomFieldFragment';

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
    gender
    preferredName
    firstName
    lastName
    birthDate
    email
    photo
    coverImage
    isActive
  }
`;

export const BENEFICIARY_STATUS_ENTRY_DETAILS = gql`
  fragment BeneficiaryStatusEntryFragment on BeneficiaryStatusEntryType {
    id
    document
    beneficiaryStatus{
      id
      name
    }
    startingDate
    endingDate
  }
`;

export const BENEFICIARY_ENDOWMENT_ENTRY_DETAILS = gql`
  fragment BeneficiaryEndowmentEntryFragment on BeneficiaryEndowmentEntryType {
    id
    initialBalance
    endowmentType{
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
    dueDate
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
    birthCity
    birthCountry
    nationality
    age
    professionalStatus{
      id
      name
    }
    beneficiaryStatusEntries{
      ...BeneficiaryStatusEntryFragment
    }
    beneficiaryEntries{
      ...BeneficiaryEntryFragment
    }
    customFieldValues{
      ...CustomFieldValueDetailsFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${BENEFICIARY_MINI_INFOS}
  ${BENEFICIARY_STATUS_ENTRY_DETAILS}
  ${BENEFICIARY_ENTRY_DETAILS}
  ${CUSTOM_FIELD_VALUE_DETAILS}
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
    additionalAddress
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
    beneficiaryEndowmentEntries{
      ...BeneficiaryEndowmentEntryFragment
    }
  }
  ${BENEFICIARY_BASIC_INFOS}
  ${BENEFICIARY_ADMISSION_DETAILS}
  ${BENEFICIARY_ENDOWMENT_ENTRY_DETAILS}
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
    beneficiaryEndowmentEntries{
      ...BeneficiaryEndowmentEntryFragment
    }
    balanceDetails
    balance
    totalExpenses
    totalPayments
    createdAt
    updatedAt
  }
  ${BENEFICIARY_BASIC_INFOS}
  ${BENEFICIARY_ADMISSION_DETAILS}
  ${BENEFICIARY_ENDOWMENT_ENTRY_DETAILS}
`;

