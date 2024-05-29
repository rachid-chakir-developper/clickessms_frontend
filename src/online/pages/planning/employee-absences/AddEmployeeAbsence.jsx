import * as React from 'react';
import AddEmployeeAbsenceForm from './AddEmployeeAbsenceForm';
import { useParams } from 'react-router-dom';

export default function AddEmployeeAbsence() {
  let { idEmployeeAbsence } = useParams();
  return (
    <AddEmployeeAbsenceForm
      idEmployeeAbsence={idEmployeeAbsence}
      title={
        idEmployeeAbsence && idEmployeeAbsence > 0
          ? `Modifier l'absence`
          : `Ajouter une absence`
      }
    />
  );
}
