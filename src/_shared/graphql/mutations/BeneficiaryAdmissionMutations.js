import { gql } from '@apollo/client';
import { BENEFICIARY_ADMISSION_BASIC_INFOS } from '../fragments/BeneficiaryAdmissionFragment';
import { BENEFICIARY_BASIC_INFOS } from '../fragments/BeneficiaryFragment';

export const POST_BENEFICIARY_ADMISSION = gql`
  mutation CreateBeneficiaryAdmission($beneficiaryAdmissionData: BeneficiaryAdmissionInput!, $files : [MediaInput]) {
    createBeneficiaryAdmission(beneficiaryAdmissionData: $beneficiaryAdmissionData, files: $files) {
      beneficiaryAdmission {
        ...BeneficiaryAdmissionBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_ADMISSION_BASIC_INFOS}
`;

export const PUT_BENEFICIARY_ADMISSION = gql`
  mutation UpdateBeneficiaryAdmission(
    $id: ID!
    $beneficiaryAdmissionData: BeneficiaryAdmissionInput!
    $files : [MediaInput]
  ) {
    updateBeneficiaryAdmission(id: $id, beneficiaryAdmissionData: $beneficiaryAdmissionData, files: $files) {
      beneficiaryAdmission {
        ...BeneficiaryAdmissionBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_ADMISSION_BASIC_INFOS}
`;

export const PUT_BENEFICIARY_ADMISSION_STATE = gql`
  mutation UpdateBeneficiaryAdmissionState($id: ID!) {
    updateBeneficiaryAdmissionState(id: $id) {
      done
      success
      message
      beneficiaryAdmission {
        ...BeneficiaryAdmissionBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_ADMISSION_BASIC_INFOS}
`;

export const PUT_BENEFICIARY_ADMISSION_FIELDS = gql`
  mutation UpdateBeneficiaryAdmissionFields($id: ID!, $beneficiaryAdmissionData: BeneficiaryAdmissionFieldInput!) {
    updateBeneficiaryAdmissionFields(id: $id, beneficiaryAdmissionData: $beneficiaryAdmissionData) {
      done
      success
      message
      beneficiaryAdmission {
        ...BeneficiaryAdmissionBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_ADMISSION_BASIC_INFOS}
`;

export const GENERATE_BENEFICIARY_FROM_BENEFICIARY_ADMISSION = gql`
  mutation GenerateBeneficiary($idBeneficiaryAdmission: ID!) {
    generateBeneficiary(idBeneficiaryAdmission: $idBeneficiaryAdmission) {
      success
      message
      beneficiary{
        ...BeneficiaryBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_BASIC_INFOS}
`;

export const DELETE_BENEFICIARY_ADMISSION = gql`
  mutation DeleteBeneficiaryAdmission($id: ID!) {
    deleteBeneficiaryAdmission(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
