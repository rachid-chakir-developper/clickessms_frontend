import * as React from 'react';
import AddVehicleInspectionForm from './AddVehicleInspectionForm';
import { useParams } from 'react-router-dom';

export default function AddVehicleInspection() {
  let { idVehicleInspection } = useParams();
  return (
    <AddVehicleInspectionForm
      idVehicleInspection={idVehicleInspection}
      title={
        idVehicleInspection && idVehicleInspection > 0
          ? `Modifier le contrôle véhicule`
          : `Ajouter un contrôle véhicule`
      }
    />
  );
}
