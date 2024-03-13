import { gql } from '@apollo/client';
import { CLIENT_BASIC_INFOS, CLIENT_DETAILS } from '../fragments/ClientFragment';

export const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    client(id: $id) {
      ...ClientDetailsFragment
    }
  }
  ${CLIENT_DETAILS}
`;

export const GET_CLIENTS = gql`
  query GetClients($clientFilter: ClientFilterInput, $offset: Int, $limit: Int, $page: Int){
    clients(clientFilter: $clientFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...ClientBasicInfosFragment
      }
    }
  }
  ${CLIENT_BASIC_INFOS}
`;

// Add more client-related queries here
