import { gql } from '@apollo/client';
import {
  DOCUMENT_RECORD_BASIC_INFOS,
  DOCUMENT_RECORD_DETAILS,
  DOCUMENT_RECORD_RECAP_DETAILS,
} from '../fragments/DocumentRecordFragment';

export const GET_DOCUMENT_RECORD = gql`
  query GetDocumentRecord($id: ID!) {
    documentRecord(id: $id) {
      ...DocumentRecordDetailsFragment
    }
  }
  ${DOCUMENT_RECORD_DETAILS}
`;

export const GET_DOCUMENT_RECORDS = gql`
  query GetDocumentRecords(
    $documentRecordFilter: DocumentRecordFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    documentRecords(
      documentRecordFilter: $documentRecordFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...DocumentRecordBasicInfosFragment
      }
    }
  }
  ${DOCUMENT_RECORD_BASIC_INFOS}
`;

export const DOCUMENT_RECORD_RECAP = gql`
  query GetDocumentRecord($id: ID!) {
    documentRecord(id: $id) {
      ...DocumentRecordRecapDetailsFragment
    }
  }
  ${DOCUMENT_RECORD_RECAP_DETAILS}
`;
// Add more documentRecord-related queries here
