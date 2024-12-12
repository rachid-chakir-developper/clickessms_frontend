import { gql } from '@apollo/client';
import {
  THE_PASSWORD_BASIC_INFOS,
  THE_PASSWORD_DETAILS,
  THE_PASSWORD_RECAP_DETAILS,
} from '../fragments/ThePasswordFragment';

export const GET_THE_PASSWORD = gql`
  query GetThePassword($id: ID!) {
    thePassword(id: $id) {
      ...ThePasswordDetailsFragment
    }
  }
  ${THE_PASSWORD_DETAILS}
`;

export const GET_THE_PASSWORDS = gql`
  query GetThePasswords(
    $thePasswordFilter: ThePasswordFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    thePasswords(
      thePasswordFilter: $thePasswordFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...ThePasswordBasicInfosFragment
      }
    }
  }
  ${THE_PASSWORD_BASIC_INFOS}
`;

export const GET_RECAP_THE_PASSWORD = gql`
  query GetThePassword($id: ID!) {
    thePassword(id: $id) {
      ...ThePasswordRecapDetailsFragment
    }
  }
  ${THE_PASSWORD_RECAP_DETAILS}
`;