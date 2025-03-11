import * as React from 'react';
import AddJobCandidateForm from './AddJobCandidateForm';
import { useParams } from 'react-router-dom';

export default function AddJobCandidate() {
  let { idJobCandidate } = useParams();
  return (
    <AddJobCandidateForm
      idJobCandidate={idJobCandidate}
      title={
        idJobCandidate && idJobCandidate > 0 ? `Modifier le candidat` : `Ajouter un candidat`
      }
    />
  );
}
