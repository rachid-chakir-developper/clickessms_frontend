import * as React from 'react';
import AddCashRegisterTransactionForm from './AddCashRegisterTransactionForm';
import { useParams } from 'react-router-dom';

export default function AddCashRegisterTransaction() {
  let { idCashRegisterTransaction } = useParams();
  return (
    <AddCashRegisterTransactionForm
      idCashRegisterTransaction={idCashRegisterTransaction}
      title={
        idCashRegisterTransaction && idCashRegisterTransaction > 0 ? `Modifier le mouvement` : `Ajouter un mouvement`
      }
    />
  );
}
