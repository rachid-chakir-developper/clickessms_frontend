// SceMemberFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const SCE_MEMBER_PHONE_INFOS = gql`
  fragment SceMemberPhoneInfosFragment on SceMemberType {
    id
    role
    isActive
  }
`;

export const SCE_MEMBER_MINI_INFOS = gql`
  fragment SceMemberMiniInfosFragment on SceMemberType {
    id
    role
    employee {
      ...EmployeeMiniInfosFragment
    }
    isActive
  }
  ${EMPLOYEE_MINI_INFOS}
`;

export const SCE_MEMBER_BASIC_INFOS = gql`
  fragment SceMemberBasicInfosFragment on SceMemberType {
    ...SceMemberMiniInfosFragment
    folder {
      id
      number
      name
    }
  }
  ${SCE_MEMBER_MINI_INFOS}
`;

export const SCE_MEMBER_DETAILS = gql`
  fragment SceMemberDetailsFragment on SceMemberType {
    ...SceMemberBasicInfosFragment
    description
    observation
  }
  ${SCE_MEMBER_BASIC_INFOS}
`;
