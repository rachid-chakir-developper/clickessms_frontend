import * as React from 'react';
import AddClientForm from './AddClientForm';
import { useParams } from 'react-router-dom';

export default function AddClient() {
  let { idClient } = useParams();
  return (
    <AddClientForm
      idClient={idClient}
      title={
        idClient && idClient > 0 ? `Modifier le client` : `Ajouter un client`
      }
    />
  );
}
