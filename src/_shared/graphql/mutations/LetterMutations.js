import { gql } from '@apollo/client';
import { LETTER_BASIC_INFOS } from '../fragments/LetterFragment';

export const POST_LETTER = gql`
  mutation CreateLetter($letterData: LetterInput!, $document: Upload) {
    createLetter(letterData: $letterData, document: $document) {
      letter {
        ...LetterBasicInfosFragment
      }
    }
  }
  ${LETTER_BASIC_INFOS}
`;

export const PUT_LETTER = gql`
  mutation UpdateLetter($id: ID!, $letterData: LetterInput!, $document: Upload) {
    updateLetter(id: $id, letterData: $letterData, document: $document) {
      letter {
        ...LetterBasicInfosFragment
      }
    }
  }
  ${LETTER_BASIC_INFOS}
`;

export const PUT_LETTER_STATE = gql`
  mutation UpdateLetterState($id: ID!) {
    updateLetterState(id: $id) {
      done
      success
      message
      letter {
        ...LetterBasicInfosFragment
      }
    }
  }
  ${LETTER_BASIC_INFOS}
`;

export const DELETE_LETTER = gql`
  mutation DeleteLetter($id: ID!) {
    deleteLetter(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
