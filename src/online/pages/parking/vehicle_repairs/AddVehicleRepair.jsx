import * as React from 'react';
import AddVehicleRepairForm from './AddVehicleRepairForm';
import { useParams } from 'react-router-dom';

export default function AddVehicleRepair() {
  let { idVehicleRepair } = useParams();
  return (
    <AddVehicleRepairForm
      idVehicleRepair={idVehicleRepair}
      title={
        idVehicleRepair && idVehicleRepair > 0
          ? `Modifier la réparation`
          : `Ajouter une réparation`
      }
    />
  );
}
