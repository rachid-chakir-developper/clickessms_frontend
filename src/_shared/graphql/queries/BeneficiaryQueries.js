import { gql } from '@apollo/client';
import {
  BENEFICIARY_BASIC_INFOS,
  BENEFICIARY_DETAILS,
} from '../fragments/BeneficiaryFragment';

export const GET_BENEFICIARY = gql`
  query GetBeneficiary($id: ID!) {
    beneficiary(id: $id) {
      ...BeneficiaryDetailsFragment
    }
  }
  ${BENEFICIARY_DETAILS}
`;

export const GET_BENEFICIARIES = gql`
  query GetBeneficiaries(
    $beneficiaryFilter: BeneficiaryFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    beneficiaries(
      beneficiaryFilter: $beneficiaryFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...BeneficiaryBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_BASIC_INFOS}
`;

// Add more beneficiary-related queries here
