import * as React from 'react';
import AddUserForm from './AddUserForm';
import { useParams } from 'react-router-dom';

export default function AddUser() {
  let { idUser } = useParams();
  return (
    <AddUserForm
      idUser={idUser}
      title={
        idUser && idUser > 0
          ? `Modifier l'utilisateur`
          : `Ajouter un utilisateur`
      }
    />
  );
}
