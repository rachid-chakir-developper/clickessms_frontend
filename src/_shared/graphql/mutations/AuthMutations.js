import { gql } from '@apollo/client';
import { USER_DETAILS } from '../fragments/UserFragment';
import { COMPANY_BASIC_INFOS } from '../fragments/CompanyFragment';

export const LOGIN_USER = gql`
  mutation tokenAuth($email: String! , $password: String!){
    tokenAuth(email: $email, password: $password) {
      success,
      errors,
      unarchiving,
      token,
      refreshToken,
      unarchiving,
      user{
        ...UserDetailsFragment
        company{
          ...CompanyBasicInfosFragment
        }
      }
    }
  }
  ${USER_DETAILS}
  ${COMPANY_BASIC_INFOS}
`

export const LOGOUT_USER = gql`
  mutation logoutUser{
    logoutUser{
      success
      done
      message
    }
  }
`

