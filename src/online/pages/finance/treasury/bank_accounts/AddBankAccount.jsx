import * as React from 'react';
import AddBankAccountForm from './AddBankAccountForm';
import { useParams } from 'react-router-dom';

export default function AddBankAccount() {
  let { idBankAccount } = useParams();
  return (
    <AddBankAccountForm
      idBankAccount={idBankAccount}
      title={
        idBankAccount && idBankAccount > 0
          ? `Modifier le compte bancaire`
          : `Ajouter un compte bancaire`
      }
    />
  );
}
