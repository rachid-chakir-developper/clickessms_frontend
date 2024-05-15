import { gql } from '@apollo/client';
import {
  DECISION_DOCUMENT_BASIC_INFOS,
  DECISION_DOCUMENT_DETAILS,
} from '../fragments/DecisionDocumentFragment';

export const GET_DECISION_DOCUMENT = gql`
  query GetDecisionDocument($id: ID!) {
    decisionDocument(id: $id) {
      ...DecisionDocumentDetailsFragment
    }
  }
  ${DECISION_DOCUMENT_DETAILS}
`;

export const GET_DECISION_DOCUMENTS = gql`
  query GetDecisionDocuments(
    $decisionDocumentFilter: DecisionDocumentFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    decisionDocuments(
      decisionDocumentFilter: $decisionDocumentFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...DecisionDocumentBasicInfosFragment
      }
    }
  }
  ${DECISION_DOCUMENT_BASIC_INFOS}
`;

// Add more decisionDocument-related queries here
