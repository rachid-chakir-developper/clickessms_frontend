// BoxIdeaFragment.js

import { gql } from '@apollo/client';

export const BOX_IDEA_BASIC_INFOS = gql`
  fragment BoxIdeaBasicInfosFragment on BoxIdeaType {
    id
    number
    title
    link 
    description
    observation
  }
`;

export const BOX_IDEA_DETAILS = gql`
  fragment BoxIdeaDetailsFragment on BoxIdeaType {
    ...BoxIdeaBasicInfosFragment
  }
  ${BOX_IDEA_BASIC_INFOS}
`;


export const BOX_IDEA_RECAP_DETAILS = gql`
  fragment BoxIdeaRecapDetailsFragment on BoxIdeaType {
    ...BoxIdeaBasicInfosFragment
    createdAt,
    updatedAt,
  }
  ${BOX_IDEA_BASIC_INFOS}
`;
