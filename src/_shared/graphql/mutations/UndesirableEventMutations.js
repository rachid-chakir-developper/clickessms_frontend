import { gql } from '@apollo/client';
import { UNDESIRABLE_EVENT_BASIC_INFOS } from '../fragments/UndesirableEventFragment';

export const POST_UNDESIRABLE_EVENT = gql`
  mutation CreateUndesirableEvent(
    $undesirableEventData: UndesirableEventInput!
    $image: Upload, $files : [MediaInput]
  ) {
    createUndesirableEvent(
      undesirableEventData: $undesirableEventData
      image: $image, files: $files
    ) {
      undesirableEvent {
        ...UndesirableEventBasicInfosFragment
      }
    }
  }
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
`;

export const PUT_UNDESIRABLE_EVENT = gql`
  mutation UpdateUndesirableEvent(
    $id: ID!
    $undesirableEventData: UndesirableEventInput!
    $image: Upload, $files : [MediaInput]
  ) {
    updateUndesirableEvent(
      id: $id
      undesirableEventData: $undesirableEventData
      image: $image, files: $files
    ) {
      undesirableEvent {
        ...UndesirableEventBasicInfosFragment
      }
    }
  }
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
`;

export const PUT_UNDESIRABLE_EVENT_FIELDS = gql`
  mutation UpdateUndesirableEventFields($id: ID!, $undesirableEventData: UndesirableEventInput!) {
    updateUndesirableEventFields(id: $id, undesirableEventData: $undesirableEventData) {
      done
      success
      message
      undesirableEvent {
        ...UndesirableEventBasicInfosFragment
      }
    }
  }
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
`;

export const PUT_UNDESIRABLE_EVENT_STATE = gql`
  mutation UpdateUndesirableEventState($id: ID!) {
    updateUndesirableEventState(id: $id) {
      done
      success
      message
      undesirableEvent {
        ...UndesirableEventBasicInfosFragment
      }
    }
  }
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
`;
export const POST_UNDESIRABLE_EVENT_TICKET = gql`
  mutation CreateUndesirableEventTicket($id: ID!) {
    createUndesirableEventTicket(id: $id) {
      done
      success
      message
      undesirableEvent {
        ...UndesirableEventBasicInfosFragment
      }
    }
  }
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
`;

export const DELETE_UNDESIRABLE_EVENT = gql`
  mutation DeleteUndesirableEvent($id: ID!) {
    deleteUndesirableEvent(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
