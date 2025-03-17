import * as React from 'react';
import { useParams } from 'react-router-dom';
import AddJobCandidateInformationSheetForm from './AddJobCandidateInformationSheetForm';

export default function AddJobCandidateInformationSheet() {
  let { accessToken } = useParams();
  return (
    <AddJobCandidateInformationSheetForm
      accessToken={accessToken}
      title="Remplissez votre ficher de renseignement"
    />
  );
}
