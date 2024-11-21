import { gql } from '@apollo/client';
import { COMPANY_BASIC_INFOS, COMPANY_MEDIA_INFOS } from '../fragments/CompanyFragment';

export const POST_COMPANY = gql`
  mutation CreateCompany(
    $companyData: CompanyInput!
    $logo: Upload
    $coverImage: Upload
  ) {
    createCompany(
      companyData: $companyData
      logo: $logo
      coverImage: $coverImage
    ) {
      company {
        ...CompanyBasicInfosFragment
      }
    }
  }
  ${COMPANY_BASIC_INFOS}
`;

export const PUT_COMPANY = gql`
  mutation UpdateCompany(
    $id: ID
    $companyData: CompanyInput!
    $logo: Upload
    $coverImage: Upload
  ) {
    updateCompany(
      id: $id
      companyData: $companyData
      logo: $logo
      coverImage: $coverImage
    ) {
      company {
        ...CompanyBasicInfosFragment
      }
    }
  }
  ${COMPANY_BASIC_INFOS}
`;



export const PUT_COMPANY_MEDIA = gql`
  mutation UpdateCompanyMedia(
    $id: ID
    $companyMediaData: CompanyMediaInput!
    $collectiveAgreement: Upload
    $companyAgreement: Upload
  ) {
    updateCompanyMedia(
      id: $id
      companyMediaData: $companyMediaData
      collectiveAgreement: $collectiveAgreement
      companyAgreement: $companyAgreement
    ) {
      companyMedia {
        ...CompanyMediaBasicInfosFragment
      }
    }
  }
  ${COMPANY_MEDIA_INFOS}
`;


export const PUT_COMPANY_FIELDS = gql`
  mutation updateCompanyFields($id: ID!, $companyFields: CompanyFieldInput!) {
    updateCompanyFields(id: $id, companyFields: $companyFields){
      done
      success
      message
      company{
        ...CompanyBasicInfosFragment
      }
    }
  }
  ${COMPANY_BASIC_INFOS}
`;


export const PUT_COMPANY_STATE = gql`
  mutation UpdateCompanyState($id: ID!) {
    updateCompanyState(id: $id){
      done
      success
      message
      company{
        ...CompanyBasicInfosFragment
      }
    }
  }
  ${COMPANY_BASIC_INFOS}
`;


export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
