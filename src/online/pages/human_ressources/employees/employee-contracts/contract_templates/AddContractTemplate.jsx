import * as React from 'react';
import AddContractTemplateForm from './AddContractTemplateForm';
import { useParams } from 'react-router-dom';

export default function AddContractTemplate() {
  let { idContractTemplate } = useParams();
  return (
    <AddContractTemplateForm
      idContractTemplate={idContractTemplate}
      title={
        idContractTemplate && idContractTemplate > 0
          ? `Modifier le message`
          : `Ajouter un model`
      }
    />
  );
}
