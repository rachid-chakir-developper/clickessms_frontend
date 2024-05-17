// DecisionDocumentFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { FINANCIER_BASIC_INFOS } from './FinancierFragment';

export const DECISION_DOCUMENT_BASIC_INFOS = gql`
  fragment DecisionDocumentBasicInfosFragment on DecisionDocumentType {
    id
    name
    document
    decisionDate
    receptionDateTime
    isActive
    folder {
      id
      number
      name
    }
  }
`;


export const DECISION_DOCUMENT_ITEM_DETAILS = gql`
  fragment DecisionDocumentItemFragment on DecisionDocumentItemType {
    id
	startingDateTime
	endingDateTime
	price
	endowment
  occupancyRate
  theoreticalNumberUnitWork
    establishment{
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const DECISION_DOCUMENT_DETAILS = gql`
  fragment DecisionDocumentDetailsFragment on DecisionDocumentType {
    ...DecisionDocumentBasicInfosFragment
    financier{
      ...FinancierBasicInfosFragment
    }
    description
    observation
    decisionDocumentItems{
      ...DecisionDocumentItemFragment
    }
  }
  ${DECISION_DOCUMENT_BASIC_INFOS}
  ${FINANCIER_BASIC_INFOS}
  ${DECISION_DOCUMENT_ITEM_DETAILS}
`;
