// UserFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { PARTNER_MINI_INFOS } from './PartnerFragment';
import { SUPPLIER_MINI_INFOS } from './SupplierFragment';
import { FINANCIER_MINI_INFOS } from './FinancierFragment';
import { GOVERNANCE_MEMBER_MINI_INFOS } from './GovernanceMemberFragment';

export const USER_BASIC_INFOS = gql`
  fragment UserBasicInfosFragment on UserType {
    id
    firstName
    lastName
    photo
    coverImage
    email
    isMustChangePassword
    username
    currentLatitude
    currentLongitude
    isActive
    roles
    employee {
      ...EmployeeMiniInfosFragment
    }
    governanceMember {
      ...GovernanceMemberMiniInfosFragment
    }
    partner {
      ...PartnerMiniInfosFragment
    }
    financier {
      ...FinancierMiniInfosFragment
    }
    supplier {
      ...SupplierMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
  ${GOVERNANCE_MEMBER_MINI_INFOS}
  ${PARTNER_MINI_INFOS}
  ${FINANCIER_MINI_INFOS}
  ${SUPPLIER_MINI_INFOS}
`;

// export const USER_DETAILS2 = gql`
//   fragment UserDetailsFragment on UserType{
//     ...UserBasicInfosFragment
//     description,
//     observation,
//     employee{
//       ...EmployeeMiniInfosFragment
//     }
//     groups{
//       id,
//       name
//     },
//     userPermissions{
//       id,
//       name
//     }
//   }
//   ${USER_BASIC_INFOS}
//   ${EMPLOYEE_MINI_INFOS}
// `;

export const USER_DETAILS = gql`
  fragment UserDetailsFragment on UserType {
    ...UserBasicInfosFragment
    description
    observation
    groups {
      id
      name
    }
    userPermissions {
      id
      name
    }
  }
  ${USER_BASIC_INFOS}
`;

// export const USER_DETAILS2 = gql`
//   fragment UserDetailsFragment on UserType {
//     ...UserBasicInfosFragment
//     description
//     observation
//     isCguAccepted
//     isOnline
//     isSuperuser
//     isStaff
//     isActive
//     dateJoined
//     groups{
//       id
//       name
//     }
//     userPermissions{
//       id
//       name
//     }
//     creator{
//       ...UserBasicInfosFragment
//     }
//     employee{
//       ...EmployeeMiniInfosFragment
//     }
//   }
//   ${USER_BASIC_INFOS}
//   ${EMPLOYEE_MINI_INFOS}
// `;
