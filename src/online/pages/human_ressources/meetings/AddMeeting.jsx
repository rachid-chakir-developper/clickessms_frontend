import * as React from 'react';
import AddMeetingForm from './AddMeetingForm';
import { useParams } from 'react-router-dom';

export default function AddMeeting() {
  let { idMeeting } = useParams();
  return (
    <AddMeetingForm
      idMeeting={idMeeting}
      title={
        idMeeting && idMeeting > 0
          ? `Modifier l'entretien`
          : `Ajouter un entretien`
      }
    />
  );
}
