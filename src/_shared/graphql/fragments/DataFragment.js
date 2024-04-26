// DataFragment.js

import { gql } from '@apollo/client';

export const DATA_BASIC_INFOS = gql`
  fragment DataBasicInfosFragment on DataType {
    id
    name
    description
  }
`;

export const PHONE_NUMBER_INFOS = gql`
  fragment PhoneNumberInfosFragment on PhoneNumberType {
    id
    name
    phone
    description
  }
`;
