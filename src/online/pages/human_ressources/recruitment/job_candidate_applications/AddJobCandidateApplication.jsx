import * as React from 'react';
import AddJobCandidateApplicationForm from './AddJobCandidateApplicationForm';
import { useParams } from 'react-router-dom';

export default function AddJobCandidateApplication() {
  let { idJobCandidateApplication } = useParams();
  return (
    <AddJobCandidateApplicationForm
      idJobCandidateApplication={idJobCandidateApplication}
      title={
        idJobCandidateApplication && idJobCandidateApplication > 0 ? `Modifier la candidature` : `Ajouter une candidature`
      }
    />
  );
}
