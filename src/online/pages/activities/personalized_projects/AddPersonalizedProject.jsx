import * as React from 'react';
import AddPersonalizedProjectForm from './AddPersonalizedProjectForm';
import { useParams } from 'react-router-dom';

export default function AddPersonalizedProject() {
  let { idPersonalizedProject } = useParams();
  return (
    <AddPersonalizedProjectForm
      idPersonalizedProject={idPersonalizedProject}
      title={
        idPersonalizedProject && idPersonalizedProject > 0
          ? `Modifier le projet personnalisé`
          : `Ajouter un projet personnalisé`
      }
    />
  );
}
