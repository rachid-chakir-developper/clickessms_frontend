import { gql } from '@apollo/client';
import { TRANSMISSION_EVENT_BASIC_INFOS } from '../fragments/TransmissionEventFragment';

export const POST_TRANSMISSION_EVENT = gql`
  mutation CreateTransmissionEvent($transmissionEventData: TransmissionEventInput!, $image: Upload) {
    createTransmissionEvent(transmissionEventData: $transmissionEventData, image: $image) {
      transmissionEvent {
        ...TransmissionEventBasicInfosFragment
      }
    }
  }
  ${TRANSMISSION_EVENT_BASIC_INFOS}
`;

export const PUT_TRANSMISSION_EVENT = gql`
  mutation UpdateTransmissionEvent($id: ID!, $transmissionEventData: TransmissionEventInput!, $image: Upload) {
    updateTransmissionEvent(id: $id, transmissionEventData: $transmissionEventData, image: $image) {
      transmissionEvent {
        ...TransmissionEventBasicInfosFragment
      }
    }
  }
  ${TRANSMISSION_EVENT_BASIC_INFOS}
`;

export const PUT_TRANSMISSION_EVENT_STATE = gql`
  mutation UpdateTransmissionEventState($id: ID!) {
    updateTransmissionEventState(id: $id) {
      done
      success
      message
      transmissionEvent {
        ...TransmissionEventBasicInfosFragment
      }
    }
  }
  ${TRANSMISSION_EVENT_BASIC_INFOS}
`;

export const DELETE_TRANSMISSION_EVENT = gql`
  mutation DeleteTransmissionEvent($id: ID!) {
    deleteTransmissionEvent(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
