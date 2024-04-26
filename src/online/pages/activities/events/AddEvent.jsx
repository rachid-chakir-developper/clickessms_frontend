import * as React from 'react';
import AddEventForm from './AddEventForm';
import { useParams } from 'react-router-dom';

export default function AddEvent() {
  let { idEvent } = useParams();
  return (
    <AddEventForm
      idEvent={idEvent}
      title={
        idEvent && idEvent > 0 ? `Modifier l'événement` : `Ajouter un événement`
      }
    />
  );
}
