import { gql } from '@apollo/client';
import { UDESIRABLE_EVENT_BASIC_INFOS } from '../fragments/UndesirableEventFragment';

export const POST_UDESIRABLE_EVENT = gql`
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
  ${UDESIRABLE_EVENT_BASIC_INFOS}
`;

export const PUT_UDESIRABLE_EVENT = gql`
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
  ${UDESIRABLE_EVENT_BASIC_INFOS}
`;

export const PUT_UDESIRABLE_EVENT_STATE = gql`
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
  ${UDESIRABLE_EVENT_BASIC_INFOS}
`;

export const DELETE_UDESIRABLE_EVENT = gql`
  mutation DeleteUndesirableEvent($id: ID!) {
    deleteUndesirableEvent(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
