// DocumentRecordFragment.js

import { gql } from '@apollo/client';

export const DOCUMENT_RECORD_BASIC_INFOS = gql`
    fragment DocumentRecordBasicInfosFragment on DocumentRecordType {
        id
        name
        document
        documentType{
            id
            name
        }
        startingDate
        endingDate
        description
        isNotificationEnabled
        isActive
    }
`;

export const DOCUMENT_RECORD_DETAILS = gql`
    fragment DocumentRecordDetailsFragment on DocumentRecordType {
        ...DocumentRecordBasicInfosFragment
    }
    ${DOCUMENT_RECORD_BASIC_INFOS}
`;

export const DOCUMENT_RECORD_RECAP_DETAILS = gql`
    fragment DocumentRecordRecapDetailsFragment on DocumentRecordType {
        ...DocumentRecordBasicInfosFragment
        createdAt
        updatedAt
    }
    ${DOCUMENT_RECORD_BASIC_INFOS}
`;
