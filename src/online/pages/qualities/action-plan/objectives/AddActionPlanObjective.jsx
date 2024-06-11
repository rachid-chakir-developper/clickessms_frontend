import * as React from 'react';
import AddActionPlanObjectiveForm from './AddActionPlanObjectiveForm';
import { useParams } from 'react-router-dom';

export default function AddActionPlanObjective() {
  let { idActionPlanObjective, idUndesirableEvent } = useParams();
  return (
    <AddActionPlanObjectiveForm
      idActionPlanObjective={idActionPlanObjective}
      idUndesirableEvent={idUndesirableEvent}
      title={
        idActionPlanObjective && idActionPlanObjective > 0
          ? `Modifier l'objectif`
          : `Ajouter un objectif`
      }
    />
  );
}
