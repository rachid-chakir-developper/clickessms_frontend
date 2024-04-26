import { gql } from '@apollo/client';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';
import { CLIENT_BASIC_INFOS } from './ClientFragment';

// Fragment pour obtenir des informations de base sur un projet
export const PROJECT_BASIC_INFOS = gql`
  fragment ProjectBasicInfosFragment on Project {
    id
    number
    name
    photo
    description
    observation
  }
`;

// Fragment pour obtenir des informations détaillées sur un projet
export const PROJECT_DETAILS = gql`
  fragment ProjectDetailsFragment on Project {
    ...ProjectBasicInfosFragment
    startingDate
    endingDate
    estimatedBudget
    latitude
    longitude
    city
    zipCode
    address
    isActive
    category
    size
    owners {
      ...ClientBasicInfosFragment
    }
    managers {
      ...EmployeeBasicInfosFragment
    }
  }
  ${PROJECT_BASIC_INFOS}
  ${CLIENT_BASIC_INFOS}
  ${EMPLOYEE_BASIC_INFOS}
`;

// Vous pouvez définir d'autres fragments pour d'autres types de données ici
