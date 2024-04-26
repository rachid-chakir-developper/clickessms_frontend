import { gql } from '@apollo/client';
import { USER_DETAILS } from '../fragments/UserFragment';
import { COMPANY_BASIC_INFOS } from '../fragments/CompanyFragment';

export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      ...UserDetailsFragment
      company {
        ...CompanyBasicInfosFragment
      }
    }
  }
  ${USER_DETAILS}
  ${COMPANY_BASIC_INFOS}
`;
