import { gql } from '@apollo/client';
import { ESTABLISHMENT_BASIC_INFOS } from '../fragments/EstablishmentFragment';

export const POST_ESTABLISHMENT = gql`
  mutation CreateEstablishment(
    $establishmentData: EstablishmentInput!
    $logo: Upload
    $coverImage: Upload
  ) {
    createEstablishment(
      establishmentData: $establishmentData
      logo: $logo
      coverImage: $coverImage
    ) {
      establishment {
        ...EstablishmentBasicInfosFragment
      }
    }
  }
  ${ESTABLISHMENT_BASIC_INFOS}
`;

export const PUT_ESTABLISHMENT = gql`
  mutation UpdateEstablishment(
    $id: ID!
    $establishmentData: EstablishmentInput!
    $logo: Upload
    $coverImage: Upload
  ) {
    updateEstablishment(
      id: $id
      establishmentData: $establishmentData
      logo: $logo
      coverImage: $coverImage
    ) {
      establishment {
        ...EstablishmentBasicInfosFragment
      }
    }
  }
  ${ESTABLISHMENT_BASIC_INFOS}
`;

export const PUT_ESTABLISHMENT_STATE = gql`
  mutation UpdateEstablishmentState($id: ID!) {
    updateEstablishmentState(id: $id) {
      done
      success
      message
      establishment {
        ...EstablishmentBasicInfosFragment
      }
    }
  }
  ${ESTABLISHMENT_BASIC_INFOS}
`;

export const DELETE_ESTABLISHMENT = gql`
  mutation DeleteEstablishment($id: ID!) {
    deleteEstablishment(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
