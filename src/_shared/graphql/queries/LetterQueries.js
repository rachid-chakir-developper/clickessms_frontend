import { gql } from '@apollo/client';
import {
  LETTER_BASIC_INFOS,
  LETTER_DETAILS,
  LETTER_RECAP_DETAILS,
} from '../fragments/LetterFragment';

export const GET_LETTER = gql`
  query GetLetter($id: ID!) {
    letter(id: $id) {
      ...LetterDetailsFragment
    }
  }
  ${LETTER_DETAILS}
`;

export const GET_LETTERS = gql`
  query GetLetters(
    $letterFilter: LetterFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    letters(
      letterFilter: $letterFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...LetterBasicInfosFragment
      }
    }
  }
  ${LETTER_BASIC_INFOS}
`;

export const LETTER_RECAP = gql`
  query GetLetter($id: ID!) {
    letter(id: $id) {
      ...LetterRecapDetailsFragment
    }
  }
  ${LETTER_RECAP_DETAILS}
`;
// Add more letter-related queries here
