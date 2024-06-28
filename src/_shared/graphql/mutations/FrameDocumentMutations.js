import { gql } from '@apollo/client';
import { FRAME_DOCUMENT_BASIC_INFOS } from '../fragments/FrameDocumentFragment';

export const POST_FRAME_DOCUMENT = gql`
  mutation CreateFrameDocument(
    $frameDocumentData: FrameDocumentInput!
    $document: Upload
  ) {
    createFrameDocument(frameDocumentData: $frameDocumentData, document: $document) {
      frameDocument {
        ...FrameDocumentBasicInfosFragment
      }
    }
  }
  ${FRAME_DOCUMENT_BASIC_INFOS}
`;

export const PUT_FRAME_DOCUMENT = gql`
  mutation UpdateFrameDocument(
    $id: ID!
    $frameDocumentData: FrameDocumentInput!
    $document: Upload
  ) {
    updateFrameDocument(
      id: $id
      frameDocumentData: $frameDocumentData
      document: $document
    ) {
      frameDocument {
        ...FrameDocumentBasicInfosFragment
      }
    }
  }
  ${FRAME_DOCUMENT_BASIC_INFOS}
`;

export const DELETE_FRAME_DOCUMENT = gql`
  mutation DeleteFrameDocument($id: ID!) {
    deleteFrameDocument(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
