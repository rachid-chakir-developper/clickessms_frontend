import * as React from 'react';
import AddCompanyForm from './AddCompanyForm';
import { useParams } from 'react-router-dom';

export default function AddCompany() {
  let { idCompany } = useParams();
  return (
    <AddCompanyForm
      idCompany={idCompany}
      title={
        idCompany && idCompany > 0
          ? `Modifier l'association`
          : `Ajouter une association`
      }
    />
  );
}
