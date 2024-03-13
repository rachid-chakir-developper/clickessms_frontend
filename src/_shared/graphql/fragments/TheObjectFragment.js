// TheObjectFragment.js

import { gql } from '@apollo/client';
import { USER_BASIC_INFOS } from './UserFragment';
import { CLIENT_BASIC_INFOS } from './ClientFragment';
import { PARTNER_BASIC_INFOS } from './PartnerFragment';

export const THE_OBJECT_BASIC_INFOS = gql`
  fragment TheObjectBasicInfosFragment on TheObjectType {
    id
    number
    name
    image
    description
    isActive
    client{
      ...ClientBasicInfosFragment
    }
    partner{
      ...PartnerBasicInfosFragment
    }
  }
  ${CLIENT_BASIC_INFOS}
  ${PARTNER_BASIC_INFOS}
`;



export const OBJECT_RECOVERY_BASIC_INFOS = gql`
  fragment ObjectRecoveryBasicInfosFragment on ObjectRecoveryType {
    id
    number
    name
    description
    recoveryDate
    returnDate
    createdAt
    updatedAt
    observation
    creator{
      ...UserBasicInfosFragment
    }
    images{
      id
      caption
      image
      createdAt
      updatedAt
      creator{
        ...UserBasicInfosFragment
      }
    }
    videos{
      id
      caption
      video
      thumbnail
      createdAt
      updatedAt
      creator{
        ...UserBasicInfosFragment
      }
    }
  }
  ${USER_BASIC_INFOS}
`;

export const THE_OBJECT_DETAILS = gql`
  fragment TheObjectDetailsFragment on TheObjectType {
    ...TheObjectBasicInfosFragment
    observation
  }
  ${THE_OBJECT_BASIC_INFOS}
`;

export const THE_OBJECT_RECAP_DETAILS = gql`
  fragment TheObjectRecapDetailsFragment on TheObjectType {
    ...TheObjectBasicInfosFragment
    observation
    theObjectRecoveries{
      ...ObjectRecoveryBasicInfosFragment
    }
  }
  ${THE_OBJECT_BASIC_INFOS}
  ${OBJECT_RECOVERY_BASIC_INFOS}
`;

export const OBJECT_RECOVERY_DETAILS = gql`
  fragment ObjectRecoveryDetailsFragment on ObjectRecoveryType {
    ...ObjectRecoveryBasicInfosFragment
  }
  ${OBJECT_RECOVERY_BASIC_INFOS}
`;
