import * as React from 'react';
import AddPartnerForm from './AddPartnerForm';
import { useParams } from 'react-router-dom';

export default function AddPartner() {
  let { idPartner } = useParams();
  return (
    <AddPartnerForm
      idPartner={idPartner}
      title={
        idPartner && idPartner > 0
          ? `Modifier le partenaire`
          : `Ajouter un partenaire`
      }
    />
  );
}
