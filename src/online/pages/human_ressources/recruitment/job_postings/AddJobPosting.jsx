import * as React from 'react';
import AddJobPostingForm from './AddJobPostingForm';
import { useParams } from 'react-router-dom';

export default function AddJobPosting() {
  let { idJobPosting } = useParams();
  return (
    <AddJobPostingForm
      idJobPosting={idJobPosting}
      title={
        idJobPosting && idJobPosting > 0 ? `Modifier l'annonce` : `Ajouter une annonce`
      }
    />
  );
}
