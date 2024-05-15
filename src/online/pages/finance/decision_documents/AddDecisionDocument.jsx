import * as React from 'react';
import AddDecisionDocumentForm from './AddDecisionDocumentForm';
import { useParams } from 'react-router-dom';

export default function AddDecisionDocument() {
  let { idDecisionDocument } = useParams();
  return (
    <AddDecisionDocumentForm
      idDecisionDocument={idDecisionDocument}
      title={
        idDecisionDocument && idDecisionDocument > 0
          ? `Modifier la décision`
          : `Ajouter une décision`
      }
    />
  );
}
