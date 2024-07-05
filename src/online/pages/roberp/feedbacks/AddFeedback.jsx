import * as React from 'react';
import AddFeedbackForm from './AddFeedbackForm';
import { useParams } from 'react-router-dom';

export default function AddFeedback() {
  let { idFeedback } = useParams();
  return (
    <AddFeedbackForm
      idFeedback={idFeedback}
      title={
        idFeedback && idFeedback > 0
          ? `Modifier le message`
          : `Ajouter un message`
      }
    />
  );
}
