import * as React from 'react';
import AddCashRegisterForm from './AddCashRegisterForm';
import { useParams } from 'react-router-dom';

export default function AddCashRegister() {
  let { idCashRegister } = useParams();
  return (
    <AddCashRegisterForm
      idCashRegister={idCashRegister}
      title={
        idCashRegister && idCashRegister > 0 ? `Modifier le document` : `Ajouter un document`
      }
    />
  );
}
