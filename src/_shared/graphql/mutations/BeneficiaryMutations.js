import { gql } from '@apollo/client';
import { BENEFICIARY_BASIC_INFOS } from '../fragments/BeneficiaryFragment';

export const POST_BENEFICIARY = gql`
  mutation CreateBeneficiary($beneficiaryData: BeneficiaryInput!, $photo : Upload, $coverImage : Upload) {
    createBeneficiary(beneficiaryData: $beneficiaryData, photo : $photo, coverImage : $coverImage) {
      beneficiary{
        ...BeneficiaryBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_BASIC_INFOS}
`;

export const PUT_BENEFICIARY = gql`
  mutation UpdateBeneficiary($id: ID!, $beneficiaryData: BeneficiaryInput!, $photo : Upload, $coverImage : Upload) {
    updateBeneficiary(id: $id, beneficiaryData: $beneficiaryData, photo : $photo, coverImage : $coverImage) {
      beneficiary{
        ...BeneficiaryBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_BASIC_INFOS}
`;

export const PUT_BENEFICIARY_STATE = gql`
  mutation UpdateBeneficiaryState($id: ID!) {
    updateBeneficiaryState(id: $id){
      done
      success
      message
      beneficiary{
        ...BeneficiaryBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_BASIC_INFOS}
`;

export const DELETE_BENEFICIARY = gql`
  mutation DeleteBeneficiary($id: ID!) {
    deleteBeneficiary(id: $id){
      id
      success
      deleted
      message
    }
  }
`;