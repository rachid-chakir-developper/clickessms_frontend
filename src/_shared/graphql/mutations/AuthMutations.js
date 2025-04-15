import { gql } from '@apollo/client';
import { USER_DETAILS } from '../fragments/UserFragment';
import { COMPANY_BASIC_INFOS } from '../fragments/CompanyFragment';

export const LOGIN_USER = gql`
  mutation tokenAuth($username: String, $email: String, $password: String!) {
    tokenAuth(username: $username, email: $email, password: $password) {
      success
      errors
      unarchiving
      token
      refreshToken
      unarchiving
      user {
        ...UserDetailsFragment
        company {
          ...CompanyBasicInfosFragment
        }
      }
    }
  }
  ${USER_DETAILS}
  ${COMPANY_BASIC_INFOS}
`;

export const LOGOUT_USER = gql`
  mutation logoutUser {
    logoutUser {
      success
      done
      message
    }
  }
`;

export const PUT_MY_FIRST_PASSWORD = gql`
  mutation firstPasswordChange(
    $oldPassword: String!
    $newPassword1: String!
    $newPassword2: String!
  ) {
    firstPasswordChange(
      oldPassword: $oldPassword
      newPassword1: $newPassword1
      newPassword2: $newPassword2
    ) {
      success
      errors
      token
      refreshToken
    }
  }
`;
