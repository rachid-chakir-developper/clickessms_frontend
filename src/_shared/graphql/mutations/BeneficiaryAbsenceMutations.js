import { gql } from '@apollo/client';
import { BENEFICIARY_ABSENCE_BASIC_INFOS } from '../fragments/BeneficiaryAbsenceFragment';

export const POST_BENEFICIARY_ABSENCE = gql`
  mutation CreateBeneficiaryAbsence(
    $beneficiaryAbsenceData: BeneficiaryAbsenceInput!
  ) {
    createBeneficiaryAbsence(beneficiaryAbsenceData: $beneficiaryAbsenceData) {
      beneficiaryAbsence {
        ...BeneficiaryAbsenceBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_ABSENCE_BASIC_INFOS}
`;

export const PUT_BENEFICIARY_ABSENCE = gql`
  mutation UpdateBeneficiaryAbsence(
    $id: ID!
    $beneficiaryAbsenceData: BeneficiaryAbsenceInput!
  ) {
    updateBeneficiaryAbsence(
      id: $id
      beneficiaryAbsenceData: $beneficiaryAbsenceData
    ) {
      beneficiaryAbsence {
        ...BeneficiaryAbsenceBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_ABSENCE_BASIC_INFOS}
`;

export const PUT_BENEFICIARY_ABSENCE_STATE = gql`
  mutation UpdateBeneficiaryAbsenceState($id: ID!) {
    updateBeneficiaryAbsenceState(id: $id) {
      done
      success
      message
      beneficiaryAbsence {
        ...BeneficiaryAbsenceBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_ABSENCE_BASIC_INFOS}
`;

export const DELETE_BENEFICIARY_ABSENCE = gql`
  mutation DeleteBeneficiaryAbsence($id: ID!) {
    deleteBeneficiaryAbsence(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
