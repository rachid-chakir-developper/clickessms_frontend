import * as React from 'react';
import AddJobPositionForm from './AddJobPositionForm';
import { useParams } from 'react-router-dom';

export default function AddJobPosition() {
  let { idJobPosition } = useParams();
  return (
    <AddJobPositionForm
      idJobPosition={idJobPosition}
      title={
        idJobPosition && idJobPosition > 0 ? `Modifier la fiche besoin` : `Ajouter une fiche besoin`
      }
    />
  );
}
