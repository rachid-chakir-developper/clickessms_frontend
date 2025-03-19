// SentEmailFragment.js

import { gql } from '@apollo/client';

export const DEFAULT_SENT_EMAIL_BASIC_INFOS = gql`
    fragment DefaultSentEmailBasicInfosFragment on DefaultSentEmailType {
        recipient
        subject
        body
    }
`;

export const SENT_EMAIL_BASIC_INFOS = gql`
    fragment SentEmailBasicInfosFragment on SentEmailType {
        id
        recipient
        subject
        body
    }
`;

export const SENT_EMAIL_DETAILS = gql`
    fragment SentEmailDetailsFragment on SentEmailType {
        ...SentEmailBasicInfosFragment
    }
    ${SENT_EMAIL_BASIC_INFOS}
`;

export const SENT_EMAIL_RECAP_DETAILS = gql`
    fragment SentEmailRecapDetailsFragment on SentEmailType {
        ...SentEmailBasicInfosFragment
        createdAt
        updatedAt
    }
    ${SENT_EMAIL_BASIC_INFOS}
`;
