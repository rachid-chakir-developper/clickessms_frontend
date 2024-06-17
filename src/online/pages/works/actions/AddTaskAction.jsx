import * as React from 'react';
import AddTaskActionForm from './AddTaskActionForm';
import { useParams } from 'react-router-dom';

export default function AddTaskAction() {
  let { idTaskAction } = useParams();
  return (
    <AddTaskActionForm
      idTaskAction={idTaskAction}
      title={
        idTaskAction && idTaskAction > 0 ? `Modifier l'action` : `Ajouter une action`
      }
    />
  );
}
