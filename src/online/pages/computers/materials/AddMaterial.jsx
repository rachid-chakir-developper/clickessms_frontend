import * as React from 'react';
import AddMaterialForm from './AddMaterialForm';
import { useParams } from 'react-router-dom';

export default function AddMaterial() {
  let { idMaterial } = useParams();
  return (
    <AddMaterialForm
      idMaterial={idMaterial}
      title={
        idMaterial && idMaterial > 0
          ? `Modifier le matériel`
          : `Ajouter un matériel`
      }
    />
  );
}
