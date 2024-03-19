import { gql } from '@apollo/client';
import { BENEFICIARY_GROUP_BASIC_INFOS } from '../fragments/BeneficiaryGroupFragment';

export const POST_BENEFICIARY_GROUP = gql`
  mutation CreateBeneficiaryGroup($beneficiaryGroupData: BeneficiaryGroupInput!, $image : Upload) {
    createBeneficiaryGroup(beneficiaryGroupData: $beneficiaryGroupData, image : $image) {
      beneficiaryGroup{
        ...BeneficiaryGroupBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_GROUP_BASIC_INFOS}
`;

export const PUT_BENEFICIARY_GROUP = gql`
  mutation UpdateBeneficiaryGroup($id: ID!, $beneficiaryGroupData: BeneficiaryGroupInput!, $image : Upload) {
    updateBeneficiaryGroup(id: $id, beneficiaryGroupData: $beneficiaryGroupData, image : $image) {
      beneficiaryGroup{
        ...BeneficiaryGroupBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_GROUP_BASIC_INFOS}
`;

export const PUT_BENEFICIARY_GROUP_STATE = gql`
  mutation UpdateBeneficiaryGroupState($id: ID!) {
    updateBeneficiaryGroupState(id: $id){
      done
      success
      message
      beneficiaryGroup{
        ...BeneficiaryGroupBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_GROUP_BASIC_INFOS}
`;

export const DELETE_BENEFICIARY_GROUP = gql`
  mutation DeleteBeneficiaryGroup($id: ID!) {
    deleteBeneficiaryGroup(id: $id){
      id
      success
      deleted
      message
    }
  }
`;