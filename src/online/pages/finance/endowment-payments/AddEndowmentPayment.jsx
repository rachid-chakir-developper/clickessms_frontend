import * as React from 'react';
import AddEndowmentPaymentForm from './AddEndowmentPaymentForm';
import { useParams } from 'react-router-dom';

export default function AddEndowmentPayment() {
  let { idEndowmentPayment } = useParams();
  return (
    <AddEndowmentPaymentForm
      idEndowmentPayment={idEndowmentPayment}
      title={
        idEndowmentPayment && idEndowmentPayment > 0
          ? `Modifier le paiement`
          : `Ajouter un paiement`
      }
    />
  );
}
