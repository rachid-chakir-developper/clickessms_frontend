import * as React from 'react';
import AddAdvanceForm from './AddAdvanceForm';
import { useParams } from 'react-router-dom';

export default function EditAdvance() {
  let { idAdvance } = useParams();
  
  return (
    <AddAdvanceForm
      idAdvance={idAdvance}
      title="Modifier la demande d'acompte"
    />
  );
} 