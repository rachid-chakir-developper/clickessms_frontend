import { gql } from '@apollo/client';
import { CUSTOM_FIELD_BASIC_INFOS } from '../fragments/CustomFieldFragment';

export const POST_CUSTOM_FIELD = gql`
  mutation CreateCustomField($customFieldData: CustomFieldInput!) {
    createCustomField(customFieldData: $customFieldData) {
      customField {
        ...CustomFieldBasicInfosFragment
      }
    }
  }
  ${CUSTOM_FIELD_BASIC_INFOS}
`;

export const PUT_CUSTOM_FIELD = gql`
  mutation UpdateCustomField(
    $id: ID!
    $customFieldData: CustomFieldInput!
  ) {
    updateCustomField(id: $id, customFieldData: $customFieldData) {
      customField {
        ...CustomFieldBasicInfosFragment
      }
    }
  }
  ${CUSTOM_FIELD_BASIC_INFOS}
`;

export const PUT_CUSTOM_FIELD_STATE = gql`
  mutation UpdateCustomFieldState($id: ID!) {
    updateCustomFieldState(id: $id) {
      done
      success
      message
      customField {
        ...CustomFieldBasicInfosFragment
      }
    }
  }
  ${CUSTOM_FIELD_BASIC_INFOS}
`;

export const DELETE_CUSTOM_FIELD = gql`
  mutation DeleteCustomField($id: ID!) {
    deleteCustomField(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;