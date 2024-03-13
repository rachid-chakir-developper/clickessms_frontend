import { gql } from '@apollo/client';
import { ESTABLISHMENT_BASIC_INFOS, ESTABLISHMENT_DETAILS } from '../fragments/EstablishmentFragment';

export const GET_ESTABLISHMENT = gql`
  query GetEstablishment($id: ID!) {
    establishment(id: $id) {
      ...EstablishmentDetailsFragment
    }
  }
  ${ESTABLISHMENT_DETAILS}
`;

export const GET_ESTABLISHMENTS = gql`
  query GetEstablishments($establishmentFilter: EstablishmentFilterInput, $offset: Int, $limit: Int, $page: Int){
    establishments(establishmentFilter: $establishmentFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...EstablishmentBasicInfosFragment
      }
    }
  }
  ${ESTABLISHMENT_BASIC_INFOS}
`;

// Add more establishment-related queries here
