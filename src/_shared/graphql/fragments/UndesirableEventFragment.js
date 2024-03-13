// UndesirableEventFragment.js

import { gql } from '@apollo/client';

export const UDESIRABLE_EVENT_BASIC_INFOS = gql`
  fragment UndesirableEventBasicInfosFragment on UndesirableEventType {
    id
    number
    title
    image
    startingDateTime
    endingDateTime
    description
    isActive
  }
`;


export const UDESIRABLE_EVENT_DETAILS = gql`
  fragment UndesirableEventDetailsFragment on UndesirableEventType {
    ...UndesirableEventBasicInfosFragment
    observation
  }
  ${UDESIRABLE_EVENT_BASIC_INFOS}
`;

export const UDESIRABLE_EVENT_RECAP_DETAILS = gql`
  fragment UndesirableEventRecapDetailsFragment on UndesirableEventType {
    ...UndesirableEventBasicInfosFragment
    observation
  }
  ${UDESIRABLE_EVENT_BASIC_INFOS}
`;

