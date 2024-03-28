// LetterFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';

export const LETTER_BASIC_INFOS = gql`
  fragment LetterBasicInfosFragment on LetterType {
    id
    number
    title
    letterType
    image
    entryDateTime
    description
    isActive
  }
`;

export const LETTER_BENEFICIARY_DETAILS = gql`
  fragment LetterBeneficiaryTypeFragment on LetterBeneficiaryType {
    id
    beneficiary{
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const LETTER_DETAILS = gql`
  fragment LetterDetailsFragment on LetterType {
    ...LetterBasicInfosFragment
    observation
    beneficiaries{
      ...LetterBeneficiaryTypeFragment
    }
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${LETTER_BASIC_INFOS}
  ${LETTER_BENEFICIARY_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;

export const LETTER_RECAP_DETAILS = gql`
  fragment LetterRecapDetailsFragment on LetterType {
    ...LetterBasicInfosFragment
    observation
    beneficiaries{
      ...LetterBeneficiaryTypeFragment
    }
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${LETTER_BASIC_INFOS}
  ${LETTER_BENEFICIARY_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;
