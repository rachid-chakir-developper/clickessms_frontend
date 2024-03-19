import { gql } from '@apollo/client';
import { BENEFICIARY_GROUP_BASIC_INFOS, BENEFICIARY_GROUP_DETAILS, BENEFICIARY_GROUP_RECAP_DETAILS } from '../fragments/BeneficiaryGroupFragment';

export const GET_BENEFICIARY_GROUP = gql`
  query GetBeneficiaryGroup($id: ID!) {
    beneficiaryGroup(id: $id) {
      ...BeneficiaryGroupDetailsFragment
    }
  }
  ${BENEFICIARY_GROUP_DETAILS}
`;

export const GET_BENEFICIARY_GROUPS = gql`
  query GetBeneficiaryGroups($beneficiaryGroupFilter: BeneficiaryGroupFilterInput, $offset: Int, $limit: Int, $page: Int){
    beneficiaryGroups(beneficiaryGroupFilter : $beneficiaryGroupFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...BeneficiaryGroupBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_GROUP_BASIC_INFOS}
`;


export const BENEFICIARY_GROUP_RECAP = gql`
  query GetBeneficiaryGroup($id: ID!) {
    beneficiaryGroup(id: $id) {
      ...BeneficiaryGroupRecapDetailsFragment
    }
  }
  ${BENEFICIARY_GROUP_RECAP_DETAILS}
`;
// Add more beneficiaryGroup-related queries here
