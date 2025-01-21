// EndowmentFragment.js

import { gql } from '@apollo/client';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';

export const ENDOWMENT_BASIC_INFOS = gql`
    fragment EndowmentBasicInfosFragment on EndowmentType {
        id
        number
        label
        gender
        amountAllocated
        startingDateTime
        endingDateTime
        ageMin
        ageMax
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
        isActive
    }
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
