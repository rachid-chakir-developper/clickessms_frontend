import { gql } from '@apollo/client';
import { TICKET_BASIC_INFOS } from '../fragments/TicketFragment';

export const POST_TICKET = gql`
  mutation CreateTicket($ticketData: TicketInput!) {
    createTicket(ticketData: $ticketData) {
      ticket {
        ...TicketBasicInfosFragment
      }
    }
  }
  ${TICKET_BASIC_INFOS}
`;

export const PUT_TICKET = gql`
  mutation UpdateTicket($id: ID!, $ticketData: TicketInput!) {
    updateTicket(id: $id, ticketData: $ticketData) {
      ticket {
        ...TicketBasicInfosFragment
      }
    }
  }
  ${TICKET_BASIC_INFOS}
`;

export const PUT_TICKET_STATE = gql`
  mutation UpdateTicketState($id: ID!) {
    updateTicketState(id: $id) {
      done
      success
      message
      ticket {
        ...TicketBasicInfosFragment
      }
    }
  }
  ${TICKET_BASIC_INFOS}
`;

export const DELETE_TICKET = gql`
  mutation DeleteTicket($id: ID!) {
    deleteTicket(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
