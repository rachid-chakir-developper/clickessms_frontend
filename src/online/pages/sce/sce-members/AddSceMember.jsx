import * as React from 'react';
import AddSceMemberForm from './AddSceMemberForm';
import { useParams } from 'react-router-dom';

export default function AddSceMember() {
  let { idSceMember } = useParams();
  return (
    <AddSceMemberForm
      idSceMember={idSceMember}
      title={
        idSceMember && idSceMember > 0
          ? `Modifier le membre`
          : `Ajouter un membre`
      }
    />
  );
}
