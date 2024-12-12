// ThePasswordFragment.js

import { gql } from '@apollo/client';

export const THE_PASSWORD_BASIC_INFOS = gql`
  fragment ThePasswordBasicInfosFragment on ThePasswordType {
    id
    number
    label
    identifier
    passwordText
    link 
    description
    observation
    isActive
  }
`;

export const THE_PASSWORD_DETAILS = gql`
  fragment ThePasswordDetailsFragment on ThePasswordType {
    ...ThePasswordBasicInfosFragment
  }
  ${THE_PASSWORD_BASIC_INFOS}
`;


export const THE_PASSWORD_RECAP_DETAILS = gql`
  fragment ThePasswordRecapDetailsFragment on ThePasswordType {
    ...ThePasswordBasicInfosFragment
    createdAt,
    updatedAt,
  }
  ${THE_PASSWORD_BASIC_INFOS}
`;
