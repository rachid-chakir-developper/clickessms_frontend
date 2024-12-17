// PersonalizedProjectFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';

export const PERSONALIZED_PROJECT_BASIC_INFOS = gql`
  fragment PersonalizedProjectBasicInfosFragment on PersonalizedProjectType {
    number
    title
    startingDateTime
    endingDateTime
    description
    observation
    employee{
        ...EmployeeMiniInfosFragment
    }
    beneficiary{
        ...BeneficiaryMiniInfosFragment
    }
  }
  ${EMPLOYEE_MINI_INFOS}
  ${BENEFICIARY_MINI_INFOS}
`;

export const PERSONALIZED_PROJECT_DETAILS = gql`
  fragment PersonalizedProjectDetailsFragment on PersonalizedProjectType {
    ...PersonalizedProjectBasicInfosFragment
  }
  ${PERSONALIZED_PROJECT_BASIC_INFOS}
`;


export const PERSONALIZED_PROJECT_RECAP_DETAILS = gql`
  fragment PersonalizedProjectRecapDetailsFragment on PersonalizedProjectType {
    ...PersonalizedProjectBasicInfosFragment
    createdAt,
    updatedAt,
  }
  ${PERSONALIZED_PROJECT_BASIC_INFOS}
`;
