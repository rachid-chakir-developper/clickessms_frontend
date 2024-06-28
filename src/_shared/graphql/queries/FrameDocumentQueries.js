import { gql } from '@apollo/client';
import {
  FRAME_DOCUMENT_BASIC_INFOS,
  FRAME_DOCUMENT_DETAILS,
  FRAME_DOCUMENT_RECAP_DETAILS,
} from '../fragments/FrameDocumentFragment';

export const GET_FRAME_DOCUMENT = gql`
  query GetFrameDocument($id: ID!) {
    frameDocument(id: $id) {
      ...FrameDocumentDetailsFragment
    }
  }
  ${FRAME_DOCUMENT_DETAILS}
`;

export const GET_FRAME_DOCUMENTS = gql`
  query GetFrameDocuments(
    $frameDocumentFilter: FrameDocumentFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    frameDocuments(
      frameDocumentFilter: $frameDocumentFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...FrameDocumentBasicInfosFragment
      }
    }
  }
  ${FRAME_DOCUMENT_BASIC_INFOS}
`;

export const FRAME_DOCUMENT_RECAP = gql`
  query GetFrameDocument($id: ID!) {
    frameDocument(id: $id) {
      ...FrameDocumentRecapDetailsFragment
    }
  }
  ${FRAME_DOCUMENT_RECAP_DETAILS}
`;
// Add more frameDocument-related queries here
