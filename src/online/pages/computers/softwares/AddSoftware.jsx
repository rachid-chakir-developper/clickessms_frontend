import * as React from 'react';
import AddSoftwareForm from './AddSoftwareForm';
import { useParams } from 'react-router-dom';

export default function AddSoftware() {
  let { idSoftware } = useParams();
  return (
    <AddSoftwareForm
      idSoftware={idSoftware}
      title={
        idSoftware && idSoftware > 0
          ? `Modifier le logiciel`
          : `Ajouter un logiciel`
      }
    />
  );
}
