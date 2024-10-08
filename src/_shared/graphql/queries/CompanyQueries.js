import { gql } from '@apollo/client';
import {
  COMPANY_BASIC_INFOS,
  COMPANY_DETAILS,
} from '../fragments/CompanyFragment';

export const GET_COMPANY = gql`
  query GetCompany($id: ID) {
    company(id: $id) {
      ...CompanyDetailsFragment
    }
  }
  ${COMPANY_DETAILS}
`;

export const GET_COMPANYS = gql`
  query GetCompanys(
    $companyFilter: CompanyFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    companys(
      companyFilter: $companyFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CompanyBasicInfosFragment
      }
    }
  }
  ${COMPANY_BASIC_INFOS}
`;

// Add more company-related queries here
