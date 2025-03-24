// DocumentRecordFragment.js

import { gql } from '@apollo/client';

export const DOCUMENT_RECORD_MINI_INFOS = gql`
    fragment DocumentRecordMiniInfosFragment on DocumentRecordType {
        id
        name
        document
        beneficiaryDocumentType{
            id
            name
        }
        jobCandidateDocumentType{
            id
            name
        }
        startingDate
        endingDate
        description
        isNotificationEnabled
        notificationPeriodUnit
        notificationPeriodValue
        isActive
    }
`;

export const DOCUMENT_RECORD_BASIC_INFOS = gql`
    fragment DocumentRecordBasicInfosFragment on DocumentRecordType {
        ...DocumentRecordMiniInfosFragment
    }
    ${DOCUMENT_RECORD_MINI_INFOS}
`;

export const DOCUMENT_RECORD_BASIC_DETAILS = gql`
    fragment DocumentRecordBasicDetailsFragment on DocumentRecordType {
        ...DocumentRecordBasicInfosFragment
    }
    ${DOCUMENT_RECORD_BASIC_INFOS}
`;

export const DOCUMENT_RECORD_DETAILS = gql`
    fragment DocumentRecordDetailsFragment on DocumentRecordType {
        ...DocumentRecordBasicDetailsFragment
        beneficiary{
            id
            preferredName
            firstName
            lastName
            email
            mobile
            fix
            photo
            coverImage
            isActive
        }
    }
    ${DOCUMENT_RECORD_BASIC_DETAILS}
`;

export const DOCUMENT_RECORD_RECAP_DETAILS = gql`
    fragment DocumentRecordRecapDetailsFragment on DocumentRecordType {
        ...DocumentRecordBasicInfosFragment
        createdAt
        updatedAt
    }
    ${DOCUMENT_RECORD_BASIC_INFOS}
`;
