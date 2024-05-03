import { gql } from '@apollo/client';
import {
  UNDESIRABLE_EVENT_BASIC_INFOS,
  UNDESIRABLE_EVENT_DETAILS,
  UNDESIRABLE_EVENT_RECAP_DETAILS,
} from '../fragments/UndesirableEventFragment';

export const GET_UNDESIRABLE_EVENT = gql`
  query GetUndesirableEvent($id: ID!) {
    undesirableEvent(id: $id) {
      ...UndesirableEventDetailsFragment
    }
  }
  ${UNDESIRABLE_EVENT_DETAILS}
`;

export const GET_UNDESIRABLE_EVENTS = gql`
  query GetUndesirableEvents(
    $undesirableEventFilter: UndesirableEventFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    undesirableEvents(
      undesirableEventFilter: $undesirableEventFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...UndesirableEventBasicInfosFragment
      }
    }
  }
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
`;

export const UNDESIRABLE_EVENT_RECAP = gql`
  query GetUndesirableEvent($id: ID!) {
    undesirableEvent(id: $id) {
      ...UndesirableEventRecapDetailsFragment
    }
  }
  ${UNDESIRABLE_EVENT_RECAP_DETAILS}
`;
// Add more undesirableEvent-related queries here
