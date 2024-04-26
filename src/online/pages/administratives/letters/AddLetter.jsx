import * as React from 'react';
import AddLetterForm from './AddLetterForm';
import { useParams } from 'react-router-dom';

export default function AddLetter() {
  let { idLetter } = useParams();
  return (
    <AddLetterForm
      idLetter={idLetter}
      title={
        idLetter && idLetter > 0 ? `Modifier l'courrier` : `Ajouter un courrier`
      }
    />
  );
}
