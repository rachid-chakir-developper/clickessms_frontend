import { gql } from '@apollo/client';
import { EVENT_BASIC_INFOS } from '../fragments/EventFragment';

export const POST_EVENT = gql`
  mutation CreateEvent($eventData: EventInput!, $image : Upload) {
    createEvent(eventData: $eventData, image : $image) {
      event{
        ...EventBasicInfosFragment
      }
    }
  }
  ${EVENT_BASIC_INFOS}
`;

export const PUT_EVENT = gql`
  mutation UpdateEvent($id: ID!, $eventData: EventInput!, $image : Upload) {
    updateEvent(id: $id, eventData: $eventData, image : $image) {
      event{
        ...EventBasicInfosFragment
      }
    }
  }
  ${EVENT_BASIC_INFOS}
`;

export const PUT_EVENT_STATE = gql`
  mutation UpdateEventState($id: ID!) {
    updateEventState(id: $id){
      done
      success
      message
      event{
        ...EventBasicInfosFragment
      }
    }
  }
  ${EVENT_BASIC_INFOS}
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id){
      id
      success
      deleted
      message
    }
  }
`;