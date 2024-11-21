import { gql } from '@apollo/client';
import {
  COMPANY_BASIC_INFOS,
  COMPANY_DETAILS,
  COMPANY_MEDIA_INFOS,
  MY_COMPANY_DETAILS,
} from '../fragments/CompanyFragment';

export const GET_MY_COMPANY = gql`
  query GetCompany($id: ID) {
    company(id: $id) {
      ...MyCompanyDetailsFragment
    }
  }
  ${MY_COMPANY_DETAILS}
`;

export const GET_MY_COMPANY_MEDIA = gql`
  query GetCompanyMedia($id: ID) {
    companyMedia(id: $id) {
      ...CompanyMediaBasicInfosFragment
    }
  }
  ${COMPANY_MEDIA_INFOS}
`;

export const GET_COMPANY = gql`
  query GetCompany($id: ID) {
    company(id: $id) {
      ...CompanyDetailsFragment
    }
  }
  ${COMPANY_DETAILS}
`;

export const GET_COMPANIES = gql`
  query GetCompanies(
    $companyFilter: CompanyFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    companies(
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
