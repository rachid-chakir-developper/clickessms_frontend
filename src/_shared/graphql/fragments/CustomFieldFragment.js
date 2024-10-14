// CustomFieldFragment.js

import { gql } from '@apollo/client';

export const CUSTOM_FIELD_OPTION_DETAILS = gql`
    fragment CustomFieldOptionFragment on CustomFieldOptionType {
        id
        label
        value
    }
`;

export const CUSTOM_FIELD_BASIC_INFOS = gql`
    fragment CustomFieldBasicInfosFragment on CustomFieldType {
        id
        label
        key
        fieldType
        formModel
        isActive
        options{
        ...CustomFieldOptionFragment
        }
    }
    ${CUSTOM_FIELD_OPTION_DETAILS}
`;


export const CUSTOM_FIELD_DETAILS = gql`
    fragment CustomFieldDetailsFragment on CustomFieldType {
        ...CustomFieldBasicInfosFragment
    }
    ${CUSTOM_FIELD_BASIC_INFOS}
`;
