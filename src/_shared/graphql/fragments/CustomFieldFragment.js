// CustomFieldFragment.js

import { gql } from '@apollo/client';

export const CUSTOM_FIELD_OPTION_DETAILS = gql`
    fragment CustomFieldOptionFragment on CustomFieldOptionType {
        id
        label
        value
    }
`;

export const CUSTOM_FIELD_MINI_INFOS = gql`
    fragment CustomFieldMiniInfosFragment on CustomFieldType {
        id
        label
        key
        fieldType
        formModel
    }
`;

export const CUSTOM_FIELD_BASIC_INFOS = gql`
    fragment CustomFieldBasicInfosFragment on CustomFieldType {
        ...CustomFieldMiniInfosFragment
        isActive
        options{
        ...CustomFieldOptionFragment
        }
    }
    ${CUSTOM_FIELD_MINI_INFOS}
    ${CUSTOM_FIELD_OPTION_DETAILS}
`;


export const CUSTOM_FIELD_DETAILS = gql`
    fragment CustomFieldDetailsFragment on CustomFieldType {
        ...CustomFieldBasicInfosFragment
    }
    ${CUSTOM_FIELD_BASIC_INFOS}
`;

export const CUSTOM_FIELD_VALUE_DETAILS = gql`
    fragment CustomFieldValueDetailsFragment on CustomFieldValueType {
        id
        value
        customField{
            ...CustomFieldMiniInfosFragment
        }
    }
    ${CUSTOM_FIELD_MINI_INFOS}
`;

