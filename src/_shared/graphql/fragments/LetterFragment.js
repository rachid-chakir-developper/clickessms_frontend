// LetterFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';

export const LETTER_ESTABLISHMENT_DETAILS = gql`
  fragment LetterEstablishmentTypeFragment on LetterEstablishmentType {
    id
    establishment{
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const LETTER_EMPLOYEE_DETAILS = gql`
  fragment LetterEmployeeTypeFragment on LetterEmployeeType {
    id
    employee{
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const LETTER_BENEFICIARY_DETAILS = gql`
  fragment LetterBeneficiaryTypeFragment on LetterBeneficiaryType {
    id
    beneficiary {
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;


export const LETTER_BASIC_INFOS = gql`
  fragment LetterBasicInfosFragment on LetterType {
    id
    number
    title
    letterType
    document
    entryDateTime
    isActive
    establishments{
      ...LetterEstablishmentTypeFragment
    }
    employees {
      ...LetterEmployeeTypeFragment
    }
    beneficiaries {
      ...LetterBeneficiaryTypeFragment
    }
  }
  ${LETTER_ESTABLISHMENT_DETAILS}
  ${LETTER_EMPLOYEE_DETAILS}
  ${LETTER_BENEFICIARY_DETAILS}
`;

export const LETTER_DETAILS = gql`
  fragment LetterDetailsFragment on LetterType {
    ...LetterBasicInfosFragment
    description
    observation
  }
  ${LETTER_BASIC_INFOS}
`;

export const LETTER_RECAP_DETAILS = gql`
  fragment LetterRecapDetailsFragment on LetterType {
    ...LetterBasicInfosFragment
    description
    observation
  }
  ${LETTER_BASIC_INFOS}
`;
