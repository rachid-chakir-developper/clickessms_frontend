import { gql } from '@apollo/client';
import { UDESIRABLE_EVENT_BASIC_INFOS, UDESIRABLE_EVENT_DETAILS, UDESIRABLE_EVENT_RECAP_DETAILS } from '../fragments/UndesirableEventFragment';

export const GET_UDESIRABLE_EVENT = gql`
  query GetUndesirableEvent($id: ID!) {
    undesirableEvent(id: $id) {
      ...UndesirableEventDetailsFragment
    }
  }
  ${UDESIRABLE_EVENT_DETAILS}
`;

export const GET_UNDESIRABLE_EVENTS = gql`
  query GetUndesirableEvents($undesirableEventFilter: UndesirableEventFilterInput, $offset: Int, $limit: Int, $page: Int){
    undesirableEvents(undesirableEventFilter : $undesirableEventFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...UndesirableEventBasicInfosFragment
      }
    }
  }
  ${UDESIRABLE_EVENT_BASIC_INFOS}
`;


export const UDESIRABLE_EVENT_RECAP = gql`
  query GetUndesirableEvent($id: ID!) {
    undesirableEvent(id: $id) {
      ...UndesirableEventRecapDetailsFragment
    }
  }
  ${UDESIRABLE_EVENT_RECAP_DETAILS}
`;
// Add more undesirableEvent-related queries here
