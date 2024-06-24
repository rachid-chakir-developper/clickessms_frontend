import { gql } from '@apollo/client';
import {
  TRANSMISSION_EVENT_BASIC_INFOS,
  TRANSMISSION_EVENT_DETAILS,
  TRANSMISSION_EVENT_RECAP_DETAILS,
} from '../fragments/TransmissionEventFragment';

export const GET_TRANSMISSION_EVENT = gql`
  query GetTransmissionEvent($id: ID!) {
    transmissionEvent(id: $id) {
      ...TransmissionEventDetailsFragment
    }
  }
  ${TRANSMISSION_EVENT_DETAILS}
`;

export const GET_TRANSMISSION_EVENTS = gql`
  query GetTransmissionEvents(
    $transmissionEventFilter: TransmissionEventFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    transmissionEvents(
      transmissionEventFilter: $transmissionEventFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...TransmissionEventBasicInfosFragment
      }
    }
  }
  ${TRANSMISSION_EVENT_BASIC_INFOS}
`;

export const TRANSMISSION_EVENT_RECAP = gql`
  query GetTransmissionEvent($id: ID!) {
    transmissionEvent(id: $id) {
      ...TransmissionEventRecapDetailsFragment
    }
  }
  ${TRANSMISSION_EVENT_RECAP_DETAILS}
`;
// Add more transmissionEvent-related queries here
