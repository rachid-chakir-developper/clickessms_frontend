import * as React from 'react';
import AddFinancierForm from './AddFinancierForm';
import { useParams } from 'react-router-dom';

export default function AddFinancier() {
  let { idFinancier } = useParams();
  return (
    <AddFinancierForm
      idFinancier={idFinancier}
      title={
        idFinancier && idFinancier > 0
          ? `Modifier le financeur`
          : `Ajouter un financeur`
      }
    />
  );
}
