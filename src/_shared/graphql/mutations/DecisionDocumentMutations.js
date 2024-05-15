import { gql } from '@apollo/client';
import { DECISION_DOCUMENT_BASIC_INFOS } from '../fragments/DecisionDocumentFragment';

export const POST_DECISION_DOCUMENT = gql`
  mutation CreateDecisionDocument($decisionDocumentData: DecisionDocumentInput!, $document: Upload) {
    createDecisionDocument(decisionDocumentData: $decisionDocumentData, document: $document) {
      decisionDocument {
        ...DecisionDocumentBasicInfosFragment
      }
    }
  }
  ${DECISION_DOCUMENT_BASIC_INFOS}
`;

export const PUT_DECISION_DOCUMENT = gql`
  mutation UpdateDecisionDocument(
    $id: ID!
    $decisionDocumentData: DecisionDocumentInput!
    $document: Upload
  ) {
    updateDecisionDocument(id: $id, decisionDocumentData: $decisionDocumentData, document: $document) {
      decisionDocument {
        ...DecisionDocumentBasicInfosFragment
      }
    }
  }
  ${DECISION_DOCUMENT_BASIC_INFOS}
`;

export const PUT_DECISION_DOCUMENT_STATE = gql`
  mutation UpdateDecisionDocumentState($id: ID!) {
    updateDecisionDocumentState(id: $id) {
      done
      success
      message
      decisionDocument {
        ...DecisionDocumentBasicInfosFragment
      }
    }
  }
  ${DECISION_DOCUMENT_BASIC_INFOS}
`;

export const DELETE_DECISION_DOCUMENT = gql`
  mutation DeleteDecisionDocument($id: ID!) {
    deleteDecisionDocument(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
