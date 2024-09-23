import * as React from 'react';
import AddSceBenefitForm from './AddSceBenefitForm';
import { useParams } from 'react-router-dom';

export default function AddSceBenefit() {
  let { idSceBenefit } = useParams();
  return (
    <AddSceBenefitForm
      idSceBenefit={idSceBenefit}
      title={
        idSceBenefit && idSceBenefit > 0
          ? `Modifier le message`
          : `Ajouter un avantage`
      }
    />
  );
}
