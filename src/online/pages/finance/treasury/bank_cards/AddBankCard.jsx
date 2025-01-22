import * as React from 'react';
import AddBankCardForm from './AddBankCardForm';
import { useParams } from 'react-router-dom';

export default function AddBankCard() {
  let { idBankCard } = useParams();
  return (
    <AddBankCardForm
      idBankCard={idBankCard}
      title={
        idBankCard && idBankCard > 0 ? `Modifier la carte bancaire` : `Ajouter une carte bancaire`
      }
    />
  );
}
