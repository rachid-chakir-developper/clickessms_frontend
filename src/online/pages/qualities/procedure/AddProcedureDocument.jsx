import * as React from 'react';
import AddFrameDocumentForm from './AddProcedureDocumentForm';
import { useParams } from 'react-router-dom';

export default function AddFrameDocument() {
  let { idFrameDocument } = useParams();
  return (
    <AddFrameDocumentForm
      idFrameDocument={idFrameDocument}
      title={
        idFrameDocument && idFrameDocument > 0 ? `Modifier le document` : `Ajouter un document`
      }
    />
  );
}
