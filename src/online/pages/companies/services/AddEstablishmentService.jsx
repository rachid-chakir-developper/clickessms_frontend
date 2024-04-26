import * as React from 'react';
import AddEstablishmentServiceForm from './AddEstablishmentServiceForm';
import { useParams } from 'react-router-dom';

export default function AddEstablishmentService() {
  let { idEstablishmentService } = useParams();
  return (
    <AddEstablishmentServiceForm
      idEstablishmentService={idEstablishmentService}
      title={
        idEstablishmentService && idEstablishmentService > 0
          ? `Modifier le service`
          : `Ajouter un service`
      }
    />
  );
}
