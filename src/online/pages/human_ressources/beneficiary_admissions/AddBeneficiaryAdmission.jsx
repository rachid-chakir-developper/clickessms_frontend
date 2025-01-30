import * as React from 'react';
import AddBeneficiaryAdmissionForm from './AddBeneficiaryAdmissionForm';
import { useParams } from 'react-router-dom';

export default function AddBeneficiaryAdmission() {
  let { idBeneficiaryAdmission } = useParams();
  return (
    <AddBeneficiaryAdmissionForm
      idBeneficiaryAdmission={idBeneficiaryAdmission}
      title={
        idBeneficiaryAdmission && idBeneficiaryAdmission > 0
          ? `Modifier la demande d’admission`
          : `Ajouter une demande d’admission`
      }
    />
  );
}
