import * as React from 'react';
import { Box } from '@mui/material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_TICKET_FIELDS } from '../../../../_shared/graphql/mutations/TicketMutations';



export default function TicketStatusLabelMenu({ticket, disabled}) {
  const authorizationSystem = useAuthorizationSystem();
  const canManageQuality = authorizationSystem.requestAuthorization({
    type: 'manageQuality',
  }).authorized;
    const [updateTicketFields, { loading: loadingPut }] = useMutation(PUT_TICKET_FIELDS, {
      update(cache, { data: { updateTicketFields } }) {
        const updatedTicket = updateTicketFields.ticket;
  
        cache.modify({
          fields: {
            tickets(
              existingTickets = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedTickets = existingTickets.nodes.map((ticket) =>
                readField('id', ticket) === updatedTicket.id
                  ? updatedTicket
                  : ticket,
              );
  
              return {
                totalCount: existingTickets.totalCount,
                nodes: updatedTickets,
              };
            },
          },
        });
      },
    });
  return (
    <Box>
        <CustomizedStatusLabelMenu 
            status={ticket?.status}
            type="ticket"
            loading={loadingPut}
            onChange={(status)=> {updateTicketFields({ variables: {id: ticket?.id, ticketData: {status}} })}}
            disabled={!canManageQuality}
        />
    </Box>
  );
}