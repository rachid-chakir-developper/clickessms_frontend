import * as React from 'react';
import AddGovernanceMemberForm from './AddGovernanceMemberForm';
import { useParams } from 'react-router-dom';

export default function AddGovernanceMember() {
  let { idGovernanceMember } = useParams();
  return (
    <AddGovernanceMemberForm
      idGovernanceMember={idGovernanceMember}
      title={
        idGovernanceMember && idGovernanceMember > 0
          ? `Modifier le membre`
          : `Ajouter un membre`
      }
    />
  );
}
