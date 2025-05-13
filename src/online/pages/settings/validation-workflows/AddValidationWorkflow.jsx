import * as React from 'react';
import AddValidationWorkflowForm from './AddValidationWorkflowForm';
import { useParams } from 'react-router-dom';

export default function AddValidationWorkflow() {
  let { idValidationWorkflow } = useParams();
  return (
    <AddValidationWorkflowForm
      idValidationWorkflow={idValidationWorkflow}
      title={
        idValidationWorkflow && idValidationWorkflow > 0
          ? `Modifier le workflow`
          : `Ajouter un workflow`
      }
    />
  );
}
