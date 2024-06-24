import * as React from 'react';
import AddTransmissionEventForm from './AddTransmissionEventForm';
import { useParams } from 'react-router-dom';

export default function AddTransmissionEvent() {
  let { idTransmissionEvent } = useParams();
  return (
    <AddTransmissionEventForm
      idTransmissionEvent={idTransmissionEvent}
      title={
        idTransmissionEvent && idTransmissionEvent > 0 ? `Modifier l'événement` : `Ajouter un événement`
      }
    />
  );
}
