import * as React from 'react';
import AddPurchaseContractForm from './AddPurchaseContractForm';
import { useParams } from 'react-router-dom';

export default function AddPurchaseContract() {
  let { idPurchaseContract } = useParams();
  return (
    <AddPurchaseContractForm
      idPurchaseContract={idPurchaseContract}
      title={
        idPurchaseContract && idPurchaseContract > 0
          ? `Modifier le contrat`
          : `Ajouter une contrat`
      }
    />
  );
}
