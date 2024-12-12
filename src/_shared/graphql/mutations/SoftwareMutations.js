import { gql } from '@apollo/client';
import { SOFTWARE_BASIC_INFOS } from '../fragments/SoftwareFragment';

export const POST_SOFTWARE = gql`
  mutation CreateSoftware($softwareData: SoftwareInput!, $image: Upload) {
    createSoftware(softwareData: $softwareData, image: $image) {
      software {
        ...SoftwareBasicInfosFragment
      }
    }
  }
  ${SOFTWARE_BASIC_INFOS}
`;

export const PUT_SOFTWARE = gql`
  mutation UpdateSoftware(
    $id: ID!
    $softwareData: SoftwareInput!
    $image: Upload
  ) {
    updateSoftware(id: $id, softwareData: $softwareData, image: $image) {
      software {
        ...SoftwareBasicInfosFragment
      }
    }
  }
  ${SOFTWARE_BASIC_INFOS}
`;

export const PUT_SOFTWARE_STATE = gql`
  mutation UpdateSoftwareState($id: ID!) {
    updateSoftwareState(id: $id) {
      done
      success
      message
      software {
        ...SoftwareBasicInfosFragment
      }
    }
  }
  ${SOFTWARE_BASIC_INFOS}
`;

export const DELETE_SOFTWARE = gql`
  mutation DeleteSoftware($id: ID!) {
    deleteSoftware(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
