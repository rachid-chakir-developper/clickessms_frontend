// DataFragment.js

import { gql } from '@apollo/client';

export const DATA_BASIC_INFOS = gql`
  fragment DataBasicInfosFragment on DataType {
    id
    number
    code
    name
    description
  }
`;


export const ACCOUNTING_NATURE_BASIC_INFOS = gql`
  fragment AccountingNatureBasicInfosFragment on AccountingNatureType {
    id
    number
    code
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
