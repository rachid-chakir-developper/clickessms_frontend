import { gql } from '@apollo/client';
import {
  SOFTWARE_BASIC_INFOS,
  SOFTWARE_DETAILS,
  SOFTWARE_RECAP_DETAILS,
} from '../fragments/SoftwareFragment';

export const GET_SOFTWARE = gql`
  query GetSoftware($id: ID!) {
    software(id: $id) {
      ...SoftwareDetailsFragment
    }
  }
  ${SOFTWARE_DETAILS}
`;

export const GET_SOFTWARES = gql`
  query GetSoftwares(
    $softwareFilter: SoftwareFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    softwares(
      softwareFilter: $softwareFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...SoftwareBasicInfosFragment
      }
    }
  }
  ${SOFTWARE_BASIC_INFOS}
`;

export const GET_RECAP_SOFTWARE = gql`
  query GetSoftware($id: ID!) {
    software(id: $id) {
      ...SoftwareRecapDetailsFragment
    }
  }
  ${SOFTWARE_RECAP_DETAILS}
`;