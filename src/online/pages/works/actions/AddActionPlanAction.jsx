import * as React from 'react';
import AddActionPlanActionForm from './AddActionPlanActionForm';
import { useParams } from 'react-router-dom';

export default function AddActionPlanAction() {
  let { idActionPlanAction } = useParams();
  return (
    <AddActionPlanActionForm
      idActionPlanAction={idActionPlanAction}
      title={
        idActionPlanAction && idActionPlanAction > 0 ? `Modifier l'action` : `Ajouter une action`
      }
    />
  );
}
