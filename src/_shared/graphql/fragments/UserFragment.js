// UserFragment.js

import { gql } from '@apollo/client';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const USER_BASIC_INFOS = gql`
  fragment UserBasicInfosFragment on UserType {
    id
    firstName
    lastName
    photo
    coverImage
    email
    username
    currentLatitude
    currentLongitude
    isActive
    employee {
      ...EmployeeMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
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
