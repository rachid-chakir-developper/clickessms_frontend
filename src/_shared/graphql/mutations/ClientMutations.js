import { gql } from '@apollo/client';
import { CLIENT_BASIC_INFOS } from '../fragments/ClientFragment';

export const POST_CLIENT = gql`
  mutation CreateClient(
    $clientData: ClientInput!
    $photo: Upload
    $coverImage: Upload
  ) {
    createClient(
      clientData: $clientData
      photo: $photo
      coverImage: $coverImage
    ) {
      client {
        ...ClientBasicInfosFragment
      }
    }
  }
  ${CLIENT_BASIC_INFOS}
`;

export const PUT_CLIENT = gql`
  mutation UpdateClient(
    $id: ID!
    $clientData: ClientInput!
    $photo: Upload
    $coverImage: Upload
  ) {
    updateClient(
      id: $id
      clientData: $clientData
      photo: $photo
      coverImage: $coverImage
    ) {
      client {
        ...ClientBasicInfosFragment
      }
    }
  }
  ${CLIENT_BASIC_INFOS}
`;

export const PUT_CLIENT_STATE = gql`
  mutation UpdateClientState($id: ID!) {
    updateClientState(id: $id) {
      done
      success
      message
      client {
        ...ClientBasicInfosFragment
      }
    }
  }
  ${CLIENT_BASIC_INFOS}
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
