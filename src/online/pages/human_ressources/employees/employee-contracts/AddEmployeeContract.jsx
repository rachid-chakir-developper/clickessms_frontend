import * as React from 'react';
import AddEmployeeContractForm from './AddEmployeeContractForm';
import { useParams } from 'react-router-dom';

export default function AddEmployeeContract() {
  let { idEmployeeContract } = useParams();
  return (
    <AddEmployeeContractForm
      idEmployeeContract={idEmployeeContract}
      title={
        idEmployeeContract && idEmployeeContract > 0
          ? `Modifier le contrat d'employé`
          : `Ajouter un contrat d'employé`
      }
    />
  );
}
