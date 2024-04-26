import * as React from 'react';
import AddSupplierForm from './AddSupplierForm';
import { useParams } from 'react-router-dom';

export default function AddSupplier() {
  let { idSupplier } = useParams();
  return (
    <AddSupplierForm
      idSupplier={idSupplier}
      title={
        idSupplier && idSupplier > 0
          ? `Modifier le fournisseur`
          : `Ajouter un fournisseur`
      }
    />
  );
}
