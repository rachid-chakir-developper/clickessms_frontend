// LetterFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { PARTNER_MINI_INFOS } from './PartnerFragment';
import { SUPPLIER_MINI_INFOS } from './SupplierFragment';
import { FINANCIER_MINI_INFOS } from './FinancierFragment';

export const SENDER_DETAILS = gql`
  fragment SenderDetailsFragment on LetterSenderType {
    id
    name
    senderType
    otherSender
    employee {
      ...EmployeeMiniInfosFragment
    }
    partner {
      ...PartnerMiniInfosFragment
    }
    supplier {
      ...SupplierMiniInfosFragment
    }
    financier {
      ...FinancierMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
  ${PARTNER_MINI_INFOS}
  ${SUPPLIER_MINI_INFOS}
  ${FINANCIER_MINI_INFOS}
`;

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
    sender {
      ...SenderDetailsFragment
    }
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
  ${SENDER_DETAILS}
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
