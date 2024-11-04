import { gql } from '@apollo/client';
import {
  TICKET_BASIC_INFOS,
  TICKET_DETAILS,
} from '../fragments/TicketFragment';

export const ON_TICKET_ADDED = gql`
  subscription onTicketAdded {
    onTicketAdded {
      ticket {
        ...TicketDetailsFragment
      }
    }
  }
  ${TICKET_DETAILS}
`;

export const ON_TICKET_UPDATED = gql`
  subscription onTicketUpdated {
    onTicketUpdated {
      ticket {
        ...TicketBasicInfosFragment
      }
    }
  }
  ${TICKET_BASIC_INFOS}
`;

export const ON_TICKET_DELETED = gql`
  subscription onTicketDeleted {
    onTicketDeleted {
      ticket {
        ...TicketBasicInfosFragment
      }
    }
  }
  ${TICKET_BASIC_INFOS}
`;

// Similar subscriptions can be defined for Client and Employee entities.
