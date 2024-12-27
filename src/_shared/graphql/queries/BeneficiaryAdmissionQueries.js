import { gql } from '@apollo/client';
import {
  BENEFICIARY_ADMISSION_BASIC_INFOS,
  BENEFICIARY_ADMISSION_DETAILS,
  BENEFICIARY_ADMISSION_RECAP,
} from '../fragments/BeneficiaryAdmissionFragment';

export const GET_BENEFICIARY_ADMISSION = gql`
  query GetBeneficiaryAdmission($id: ID!) {
    beneficiaryAdmission(id: $id) {
      ...BeneficiaryAdmissionDetailsFragment
    }
  }
  ${BENEFICIARY_ADMISSION_DETAILS}
`;

export const GET_BENEFICIARY_ADMISSIONS = gql`
  query GetBeneficiaryAdmissions(
    $beneficiaryAdmissionFilter: BeneficiaryAdmissionFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    beneficiaryAdmissions(
      beneficiaryAdmissionFilter: $beneficiaryAdmissionFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...BeneficiaryAdmissionBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_ADMISSION_BASIC_INFOS}
`;


export const GET_BENEFICIARY_ADMISSION_RECAP = gql`
  query GetBeneficiaryAdmission($id: ID!) {
    beneficiaryAdmission(id: $id) {
      ...BeneficiaryAdmissionRecapFragment
    }
  }
  ${BENEFICIARY_ADMISSION_RECAP}
`;
// Add more beneficiaryAdmission-related queries here
// Add more beneficiaryAdmission-related queries here


// Add more beneficiaryAdmission-related queries here
