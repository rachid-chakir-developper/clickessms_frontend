import { gql } from '@apollo/client';
import { ESTABLISHMENT_SERVICE_BASIC_INFOS } from '../fragments/EstablishmentServiceFragment';

export const POST_ESTABLISHMENT_SERVICE = gql`
  mutation CreateEstablishmentService(
    $establishmentServiceData: EstablishmentServiceInput!
    $image: Upload
  ) {
    createEstablishmentService(
      establishmentServiceData: $establishmentServiceData
      image: $image
    ) {
      establishmentService {
        ...EstablishmentServiceBasicInfosFragment
      }
    }
  }
  ${ESTABLISHMENT_SERVICE_BASIC_INFOS}
`;

export const PUT_ESTABLISHMENT_SERVICE = gql`
  mutation UpdateEstablishmentService(
    $id: ID!
    $establishmentServiceData: EstablishmentServiceInput!
    $image: Upload
  ) {
    updateEstablishmentService(
      id: $id
      establishmentServiceData: $establishmentServiceData
      image: $image
    ) {
      establishmentService {
        ...EstablishmentServiceBasicInfosFragment
      }
    }
  }
  ${ESTABLISHMENT_SERVICE_BASIC_INFOS}
`;

export const PUT_ESTABLISHMENT_SERVICE_STATE = gql`
  mutation UpdateEstablishmentServiceState($id: ID!) {
    updateEstablishmentServiceState(id: $id) {
      done
      success
      message
      establishmentService {
        ...EstablishmentServiceBasicInfosFragment
      }
    }
  }
  ${ESTABLISHMENT_SERVICE_BASIC_INFOS}
`;

export const DELETE_ESTABLISHMENT_SERVICE = gql`
  mutation DeleteEstablishmentService($id: ID!) {
    deleteEstablishmentService(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
