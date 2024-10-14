import { gql } from '@apollo/client';
import {
  CUSTOM_FIELD_BASIC_INFOS,
  CUSTOM_FIELD_DETAILS,
} from '../fragments/CustomFieldFragment';

export const GET_CUSTOM_FIELD = gql`
  query GetCustomField($id: ID!) {
    customField(id: $id) {
      ...CustomFieldDetailsFragment
    }
  }
  ${CUSTOM_FIELD_DETAILS}
`;

export const GET_CUSTOM_FIELDS = gql`
  query GetCustomFields(
    $customFieldFilter: CustomFieldFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    customFields(
      customFieldFilter: $customFieldFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...CustomFieldBasicInfosFragment
      }
    }
  }
  ${CUSTOM_FIELD_BASIC_INFOS}
`;

// Add more customField-related queries here
