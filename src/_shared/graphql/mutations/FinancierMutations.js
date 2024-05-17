import { gql } from '@apollo/client';
import { FINANCIER_BASIC_INFOS } from '../fragments/FinancierFragment';

export const POST_FINANCIER = gql`
  mutation CreateFinancier(
    $financierData: FinancierInput!
    $photo: Upload
    $coverImage: Upload
  ) {
    createFinancier(
      financierData: $financierData
      photo: $photo
      coverImage: $coverImage
    ) {
      financier {
        ...FinancierBasicInfosFragment
      }
    }
  }
  ${FINANCIER_BASIC_INFOS}
`;

export const PUT_FINANCIER = gql`
  mutation UpdateFinancier(
    $id: ID!
    $financierData: FinancierInput!
    $photo: Upload
    $coverImage: Upload
  ) {
    updateFinancier(
      id: $id
      financierData: $financierData
      photo: $photo
      coverImage: $coverImage
    ) {
      financier {
        ...FinancierBasicInfosFragment
      }
    }
  }
  ${FINANCIER_BASIC_INFOS}
`;

export const PUT_FINANCIER_STATE = gql`
  mutation UpdateFinancierState($id: ID!) {
    updateFinancierState(id: $id) {
      done
      success
      message
      financier {
        ...FinancierBasicInfosFragment
      }
    }
  }
  ${FINANCIER_BASIC_INFOS}
`;

export const DELETE_FINANCIER = gql`
  mutation DeleteFinancier($id: ID!) {
    deleteFinancier(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
