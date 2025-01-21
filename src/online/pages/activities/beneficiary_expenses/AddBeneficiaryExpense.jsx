import * as React from 'react';
import AddBeneficiaryExpenseForm from './AddBeneficiaryExpenseForm';
import { useParams } from 'react-router-dom';

export default function AddBeneficiaryExpense() {
  let { idBeneficiaryExpense } = useParams();
  return (
    <AddBeneficiaryExpenseForm
      idBeneficiaryExpense={idBeneficiaryExpense}
      title={
        idBeneficiaryExpense && idBeneficiaryExpense > 0
          ? `Modifier le dépense`
          : `Ajouter une dépense`
      }
    />
  );
}
