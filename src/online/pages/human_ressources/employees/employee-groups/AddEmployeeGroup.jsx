import * as React from 'react';
import AddEmployeeGroupForm from './AddEmployeeGroupForm';
import { useParams } from 'react-router-dom';

export default function AddEmployeeGroup() {
  let { idEmployeeGroup } = useParams();
  return (
    <AddEmployeeGroupForm
      idEmployeeGroup={idEmployeeGroup}
      title={
        idEmployeeGroup && idEmployeeGroup > 0
          ? `Modifier le groupe d'employés`
          : `Ajouter un groupe d'employés`
      }
    />
  );
}
