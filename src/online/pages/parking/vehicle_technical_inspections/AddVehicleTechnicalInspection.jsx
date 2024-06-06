import * as React from 'react';
import AddVehicleTechnicalInspectionForm from './AddVehicleTechnicalInspectionForm';
import { useParams } from 'react-router-dom';

export default function AddVehicleTechnicalInspection() {
  let { idVehicleTechnicalInspection } = useParams();
  return (
    <AddVehicleTechnicalInspectionForm
      idVehicleTechnicalInspection={idVehicleTechnicalInspection}
      title={
        idVehicleTechnicalInspection && idVehicleTechnicalInspection > 0
          ? `Modifier le contrôle technique`
          : `Ajouter un contrôle technique`
      }
    />
  );
}
