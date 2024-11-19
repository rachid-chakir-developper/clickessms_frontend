import * as React from 'react';
import AddExpenseForm from './AddExpenseForm';
import { useParams } from 'react-router-dom';

export default function AddExpense() {
  let { idExpense } = useParams();
  return (
    <AddExpenseForm
      idExpense={idExpense}
      title={
        idExpense && idExpense > 0
          ? `Modifier la dépense`
          : `Ajouter une dépense`
      }
    />
  );
}
