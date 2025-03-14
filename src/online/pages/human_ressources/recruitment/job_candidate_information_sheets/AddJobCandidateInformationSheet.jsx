import * as React from 'react';
import AddJobCandidateInformationSheetForm from './AddJobCandidateInformationSheetForm';
import { useParams } from 'react-router-dom';

export default function AddJobCandidateInformationSheet() {
  let { idJobCandidateInformationSheet } = useParams();
  return (
    <AddJobCandidateInformationSheetForm
      idJobCandidateInformationSheet={idJobCandidateInformationSheet}
      title={
        idJobCandidateInformationSheet && idJobCandidateInformationSheet > 0 ? `Modifier le candidat` : `Ajouter un candidat`
      }
    />
  );
}
