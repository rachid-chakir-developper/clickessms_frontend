import * as React from 'react';
import AddEndowmentForm from './AddEndowmentForm';
import { useParams } from 'react-router-dom';

export default function AddEndowment() {
  let { idEndowment } = useParams();
  return (
    <AddEndowmentForm
      idEndowment={idEndowment}
      title={
        idEndowment && idEndowment > 0
          ? `Modifier la dotation`
          : `Ajouter une dotation`
      }
    />
  );
}
