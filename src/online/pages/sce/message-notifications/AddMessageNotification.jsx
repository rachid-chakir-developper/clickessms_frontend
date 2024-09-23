import * as React from 'react';
import AddMessageNotificationForm from './AddMessageNotificationForm';
import { useParams } from 'react-router-dom';

export default function AddMessageNotification() {
  let { idMessageNotification } = useParams();
  return (
    <AddMessageNotificationForm
      idMessageNotification={idMessageNotification}
      title={
        idMessageNotification && idMessageNotification > 0
          ? `Modifier le message`
          : `Ajouter une annonce`
      }
    />
  );
}
