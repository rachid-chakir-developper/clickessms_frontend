import * as React from 'react';
import AddThePasswordForm from './AddThePasswordForm';
import { useParams } from 'react-router-dom';

export default function AddThePassword() {
  let { idThePassword } = useParams();
  return (
    <AddThePasswordForm
      idThePassword={idThePassword}
      title={
        idThePassword && idThePassword > 0
          ? `Modifier le mots de passe`
          : `Ajouter un mots de passe`
      }
    />
  );
}
