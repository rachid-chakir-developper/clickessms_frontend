// BeneficiaryFragment.js

import { gql } from '@apollo/client';
import { FOLDER_MINI_INFOS } from './MediaFragment';

export const BENEFICIARY_MINI_INFOS = gql`
  fragment BeneficiaryMiniInfosFragment on BeneficiaryType {
    id,
    firstName,
    lastName,
    email
    photo
    coverImage
    isActive
  }
`;

export const BENEFICIARY_BASIC_INFOS = gql`
  fragment BeneficiaryBasicInfosFragment on BeneficiaryType {
    ...BeneficiaryMiniInfosFragment
    folder{
        id
        number
        name
    }
  }
  ${BENEFICIARY_MINI_INFOS}
`;

export const BENEFICIARY_DETAILS = gql`
  fragment BeneficiaryDetailsFragment on BeneficiaryType {
    ...BeneficiaryBasicInfosFragment
    description,
    latitude
    longitude
    country
    city,
    zipCode,
    address,
    mobile,
    fix,
    fax,
    webSite,
    otherContacts,
    iban,
    bic
    bankName,
    isActive,
    observation
  }
  ${BENEFICIARY_BASIC_INFOS}
`;
