import * as React from 'react';
import AddBalanceForm from './AddBalanceForm';
import { useParams } from 'react-router-dom';

export default function AddBalance() {
  let { idBalance } = useParams();
  return (
    <AddBalanceForm
      idBalance={idBalance}
      title={
        idBalance && idBalance > 0
          ? `Modifierle solde`
          : `Ajouter un solde`
      }
    />
  );
}
