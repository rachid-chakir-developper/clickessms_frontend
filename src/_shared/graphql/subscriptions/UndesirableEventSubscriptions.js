import { gql } from '@apollo/client';
import {
  UNDESIRABLE_EVENT_BASIC_INFOS,
  UNDESIRABLE_EVENT_DETAILS,
} from '../fragments/UndesirableEventFragment';

export const ON_UNDESIRABLE_EVENT_ADDED = gql`
  subscription onUndesirableEventAdded {
    onUndesirableEventAdded {
      undesirableEvent {
        ...UndesirableEventDetailsFragment
      }
    }
  }
  ${UNDESIRABLE_EVENT_DETAILS}
`;

export const ON_UNDESIRABLE_EVENT_UPDATED = gql`
  subscription onUndesirableEventUpdated {
    onUndesirableEventUpdated {
      undesirableEvent {
        ...UndesirableEventBasicInfosFragment
      }
    }
  }
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
`;

export const ON_UNDESIRABLE_EVENT_DELETED = gql`
  subscription onUndesirableEventDeleted {
    onUndesirableEventDeleted {
      undesirableEvent {
        ...UndesirableEventBasicInfosFragment
      }
    }
  }
  ${UNDESIRABLE_EVENT_BASIC_INFOS}
`;

// Similar subscriptions can be defined for Client and Employee entities.
