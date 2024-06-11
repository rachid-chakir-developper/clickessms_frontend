import { gql } from '@apollo/client';
import { UNDESIRABLE_EVENT_BASIC_INFOS } from '../fragments/UndesirableEventFragment';

export const POST_UNDESIRABLE_EVENT = gql`
  mutation CreateUndesirableEvent(
    $undesirableEventData: UndesirableEventInput!
    $image: Upload
  ) {
    createUndesirableEvent(
      undesirableEventData: $undesirableEventData
      image: $image
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
    $image: Upload
  ) {
    updateUndesirableEvent(
      id: $id
      undesirableEventData: $undesirableEventData
      image: $image
    ) {
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
export const POST_UNDESIRABLE_EVENT_OBJECTIVE = gql`
  mutation CreateUndesirableEventObjective($id: ID!) {
    createUndesirableEventObjective(id: $id) {
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
