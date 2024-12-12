import * as React from 'react';
import AddTheBackupForm from './AddTheBackupForm';
import { useParams } from 'react-router-dom';

export default function AddTheBackup() {
  let { idTheBackup } = useParams();
  return (
    <AddTheBackupForm
      idTheBackup={idTheBackup}
      title={
        idTheBackup && idTheBackup > 0
          ? `Modifier la sauvegarde`
          : `Ajouter une sauvegarde`
      }
    />
  );
}
