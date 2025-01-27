// EndowmentFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';

export const ENDOWMENT_MINI_INFOS = gql`
    fragment EndowmentMiniInfosFragment on EndowmentType {
        id
        number
        label
        gender
        amountAllocated
        startingDateTime
        endingDateTime
        isRecurring
        recurrenceRule
        ageMin
        ageMax
        isActive
    }
`;

export const ENDOWMENT_BASIC_INFOS = gql`
    fragment EndowmentBasicInfosFragment on EndowmentType {
        ...EndowmentMiniInfosFragment
        establishment{
        ...EstablishmentMiniInfosFragment
        }
        endowmentType{
          id
          name
        }
        professionalStatus{
          id
          name
        }
        accountingNature{
          id
          name
        }
        description
        observation
    }
    ${ENDOWMENT_MINI_INFOS}
    ${ESTABLISHMENT_MINI_INFOS}
`;

export const ENDOWMENT_DETAILS = gql`
  fragment EndowmentDetailsFragment on EndowmentType {
    ...EndowmentBasicInfosFragment
  }
  ${ENDOWMENT_BASIC_INFOS}
`;


export const ENDOWMENT_RECAP_DETAILS = gql`
  fragment EndowmentRecapDetailsFragment on EndowmentType {
    ...EndowmentBasicInfosFragment
    createdAt,
    updatedAt,
  }
  ${ENDOWMENT_BASIC_INFOS}
`;
