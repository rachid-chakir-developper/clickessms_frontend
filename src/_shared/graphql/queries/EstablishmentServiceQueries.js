import { gql } from '@apollo/client';
import { ESTABLISHMENT_SERVICE_BASIC_INFOS, ESTABLISHMENT_SERVICE_DETAILS } from '../fragments/EstablishmentServiceFragment';

export const GET_ESTABLISHMENT_SERVICE = gql`
  query GetEstablishmentService($id: ID!) {
    establishmentService(id: $id) {
      ...EstablishmentServiceDetailsFragment
    }
  }
  ${ESTABLISHMENT_SERVICE_DETAILS}
`;

export const GET_ESTABLISHMENT_SERVICES = gql`
  query GetEstablishmentServices($establishmentServiceFilter: EstablishmentServiceFilterInput, $offset: Int, $limit: Int, $page: Int){
    establishmentServices(establishmentServiceFilter: $establishmentServiceFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...EstablishmentServiceBasicInfosFragment
      }
    }
  }
  ${ESTABLISHMENT_SERVICE_BASIC_INFOS}
`;

// Add more establishmentService-related queries here
