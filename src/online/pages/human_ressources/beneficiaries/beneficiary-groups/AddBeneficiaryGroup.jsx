import * as React from 'react';
import AddBeneficiaryGroupForm from './AddBeneficiaryGroupForm';
import { useParams } from 'react-router-dom';

export default function AddBeneficiaryGroup() {
  let { idBeneficiaryGroup } = useParams();
  return (
    <AddBeneficiaryGroupForm
      idBeneficiaryGroup={idBeneficiaryGroup}
      title={
        idBeneficiaryGroup && idBeneficiaryGroup > 0
          ? `Modifier l'groupe de personnes accompagnées`
          : `Ajouter un groupe de personnes accompagnées`
      }
    />
  );
}
