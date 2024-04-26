import * as React from 'react';
import AddUndesirableEventForm from './AddUndesirableEventForm';
import { useParams } from 'react-router-dom';

export default function AddUndesirableEvent() {
  let { idUndesirableEvent } = useParams();
  return (
    <AddUndesirableEventForm
      idUndesirableEvent={idUndesirableEvent}
      title={
        idUndesirableEvent && idUndesirableEvent > 0
          ? `Modifier l'événement indésirable`
          : `Ajouter un événement indésirable`
      }
    />
  );
}
