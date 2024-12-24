import * as React from 'react';
import AddBoxIdeaForm from './AddBoxIdeaForm';
import { useParams } from 'react-router-dom';

export default function AddBoxIdea() {
  let { idBoxIdea } = useParams();
  return (
    <AddBoxIdeaForm
      idBoxIdea={idBoxIdea}
      title={
        idBoxIdea && idBoxIdea > 0
          ? `Modifier le idée`
          : `Ajouter un idée`
      }
    />
  );
}
