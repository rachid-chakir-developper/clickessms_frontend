import { gql } from '@apollo/client';
import { EVENT_BASIC_INFOS, EVENT_DETAILS, EVENT_RECAP_DETAILS } from '../fragments/EventFragment';

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventDetailsFragment
    }
  }
  ${EVENT_DETAILS}
`;

export const GET_EVENTS = gql`
  query GetEvents($eventFilter: EventFilterInput, $offset: Int, $limit: Int, $page: Int){
    events(eventFilter : $eventFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...EventBasicInfosFragment
      }
    }
  }
  ${EVENT_BASIC_INFOS}
`;


export const EVENT_RECAP = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventRecapDetailsFragment
    }
  }
  ${EVENT_RECAP_DETAILS}
`;
// Add more event-related queries here
