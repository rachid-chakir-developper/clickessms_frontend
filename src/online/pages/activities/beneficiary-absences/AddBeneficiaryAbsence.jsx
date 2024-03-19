import * as React from 'react';
import AddBeneficiaryAbsenceForm from './AddBeneficiaryAbsenceForm';
import { useParams } from 'react-router-dom';

export default function AddBeneficiaryAbsence() {
  let { idBeneficiaryAbsence } = useParams();
  return (
    <AddBeneficiaryAbsenceForm idBeneficiaryAbsence={idBeneficiaryAbsence} title={(idBeneficiaryAbsence && idBeneficiaryAbsence > 0) ? `Modifier l'absence` : `Ajouter une absence`}/>
  );
}
