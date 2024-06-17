import * as React from 'react';
import AddTicketForm from './AddTicketForm';
import { useParams } from 'react-router-dom';

export default function AddTicket() {
  let { idTicket, idUndesirableEvent } = useParams();
  return (
    <AddTicketForm
      idTicket={idTicket}
      idUndesirableEvent={idUndesirableEvent}
      title={
        idTicket && idTicket > 0
          ? `Modifier l'ticket`
          : `Ajouter un ticket`
      }
    />
  );
}
