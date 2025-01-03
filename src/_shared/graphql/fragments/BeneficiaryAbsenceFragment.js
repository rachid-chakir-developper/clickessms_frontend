// BeneficiaryAbsenceFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';


export const BENEFICIARY_ABSENCE_ITEM_DETAILS = gql`
  fragment BeneficiaryAbsenceItemTypeFragment on BeneficiaryAbsenceItemType {
    id
    beneficiary {
      ...BeneficiaryMiniInfosFragment
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const BENEFICIARY_ABSENCE_BASIC_INFOS = gql`
  fragment BeneficiaryAbsenceBasicInfosFragment on BeneficiaryAbsenceType {
    id
    number
    title
    startingDateTime
    endingDateTime
    comment
    reasons{
      id
      name
      description
    }
    otherReasons
    isConsidered
    beneficiaries {
      ...BeneficiaryAbsenceItemTypeFragment
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
  ${BENEFICIARY_ABSENCE_ITEM_DETAILS}
  ${EMPLOYEE_BASIC_INFOS}
`;
export const BENEFICIARY_ABSENCE_DETAILS = gql`
  fragment BeneficiaryAbsenceDetailsFragment on BeneficiaryAbsenceType {
    ...BeneficiaryAbsenceBasicInfosFragment
    observation
  }
  ${BENEFICIARY_ABSENCE_BASIC_INFOS}
`;

export const BENEFICIARY_ABSENCE_RECAP_DETAILS = gql`
  fragment BeneficiaryAbsenceRecapDetailsFragment on BeneficiaryAbsenceType {
    ...BeneficiaryAbsenceBasicInfosFragment
    observation
    createdAt
    updatedAt
  }
  ${BENEFICIARY_ABSENCE_BASIC_INFOS}
`;
