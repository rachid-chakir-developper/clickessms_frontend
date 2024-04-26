import * as React from 'react';
import AddBeneficiaryForm from './AddBeneficiaryForm';
import { useParams } from 'react-router-dom';

export default function AddBeneficiary() {
  let { idBeneficiary } = useParams();
  return (
    <AddBeneficiaryForm
      idBeneficiary={idBeneficiary}
      title={
        idBeneficiary && idBeneficiary > 0
          ? `Modifier le bénéficiaire`
          : `Ajouter un bénéficiaire`
      }
    />
  );
}
