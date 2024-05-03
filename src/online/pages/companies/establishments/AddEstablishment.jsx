import * as React from 'react';
import AddEstablishmentForm from './AddEstablishmentForm';
import { useParams } from 'react-router-dom';

export default function AddEstablishment() {
  let { idEstablishment } = useParams();
  return (
    <AddEstablishmentForm
      idEstablishment={idEstablishment}
      title={
        idEstablishment && idEstablishment > 0
          ? `Modifier la structure`
          : `Ajouter une structure`
      }
    />
  );
}
