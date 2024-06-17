import { gql } from '@apollo/client';
import {
  TICKET_BASIC_INFOS,
  TICKET_DETAILS,
  TICKET_RECAP_DETAILS,
} from '../fragments/TicketFragment';

export const GET_TICKET = gql`
  query GetTicket($id: ID!) {
    ticket(id: $id) {
      ...TicketDetailsFragment
    }
  }
  ${TICKET_DETAILS}
`;

export const GET_TICKETS = gql`
  query GetTickets(
    $ticketFilter: TicketFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    tickets(
      ticketFilter: $ticketFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...TicketBasicInfosFragment
      }
    }
  }
  ${TICKET_BASIC_INFOS}
`;

export const TICKET_RECAP = gql`
  query GetTicket($id: ID!) {
    ticket(id: $id) {
      ...TicketRecapDetailsFragment
      createdAt
      updatedAt
    }
  }
  ${TICKET_RECAP_DETAILS}
`;
// Add more ticket-related queries here
