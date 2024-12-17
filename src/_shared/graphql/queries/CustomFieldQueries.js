import { gql } from '@apollo/client';
import {
  CUSTOM_FIELD_BASIC_INFOS,
  CUSTOM_FIELD_DETAILS,
  CUSTOM_FIELD_VALUE_DETAILS,
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
export const GET_CUSTOM_FIELD_VALUES = gql`
query GetCustomFieldValues(
  $formModel: String!
  $idObject: ID!
) {
  customFieldValues(
    formModel: $formModel
    idObject: $idObject
  ) {
    ...CustomFieldValueDetailsFragment
  }
}
${CUSTOM_FIELD_VALUE_DETAILS}
`;
