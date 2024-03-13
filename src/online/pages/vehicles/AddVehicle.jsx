import * as React from 'react';
import AddVehicleForm from './AddVehicleForm';
import { useParams } from 'react-router-dom';

export default function AddVehicle() {
  let { idVehicle } = useParams();
  return (
    <AddVehicleForm idVehicle={idVehicle} title={(idVehicle && idVehicle > 0) ? `Modifier le véhicule` : `Ajouter un véhicule`}/>
  );
}
