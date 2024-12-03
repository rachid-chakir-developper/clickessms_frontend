// FrameDocumentFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';

export const FRAME_DOCUMENT_BASIC_INFOS = gql`
  fragment FrameDocumentBasicInfosFragment on FrameDocumentType {
    id
    number
    name
    document
    isActive
    description
    establishments{
      ...EstablishmentMiniInfosFragment
    }
    documentType{
        id
        name
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
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