// FrameDocumentFragment.js

import { gql } from '@apollo/client';

export const FRAME_DOCUMENT_BASIC_INFOS = gql`
  fragment FrameDocumentBasicInfosFragment on FrameDocumentType {
    id
    number
    name
    document
    isActive
    description
    documentType{
        id
        name
    }
  }
`;

export const FRAME_DOCUMENT_DETAILS = gql`
  fragment FrameDocumentDetailsFragment on FrameDocumentType {
    ...FrameDocumentBasicInfosFragment
  }
  ${FRAME_DOCUMENT_BASIC_INFOS}
`;

export const FRAME_DOCUMENT_RECAP_DETAILS = gql`
  fragment FrameDocumentRecapDetailsFragment on FrameDocumentType {
    ...FrameDocumentBasicInfosFragment
    createdAt
    updatedAt
  }
  ${FRAME_DOCUMENT_BASIC_INFOS}
`;