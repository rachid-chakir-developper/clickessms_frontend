import { gql } from '@apollo/client';
import {
  ESTABLISHMENT_BASIC_INFOS,
  ESTABLISHMENT_DETAILS,
  ESTABLISHMENT_RECAP_DETAILS,
} from '../fragments/EstablishmentFragment';

export const GET_ESTABLISHMENT = gql`
  query GetEstablishment($id: ID!) {
    establishment(id: $id) {
      ...EstablishmentDetailsFragment
    }
  }
  ${ESTABLISHMENT_DETAILS}
`;

export const GET_ESTABLISHMENTS = gql`
  query GetEstablishments(
    $idParent: ID,
    $establishmentFilter: EstablishmentFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    establishments(
      idParent: $idParent,
      establishmentFilter: $establishmentFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...EstablishmentBasicInfosFragment
      }
    }
  }
  ${ESTABLISHMENT_BASIC_INFOS}
`;

export const GET_RECAP_ESTABLISHMENT = gql`
  query GetEstablishment($id: ID!) {
    establishment(id: $id) {
      ...EstablishmentReacpDetailsFragment
    }
  }
  ${ESTABLISHMENT_RECAP_DETAILS}
`;


// Add more establishment-related queries here
