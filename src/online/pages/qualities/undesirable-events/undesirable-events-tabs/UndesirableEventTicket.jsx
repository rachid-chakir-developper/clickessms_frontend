import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Box, Stack } from '@mui/material';
import TicketDetails from '../../../works/tickets/TicketDetails';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function UndesirableEventTicket({undesirableEvent}) {
  return (
    <Box>
      <TicketDetails ticketId={undesirableEvent?.ticket?.id}/>
    </Box>
  );
}
