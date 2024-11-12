import * as React from 'react';
import AddBudgetForm from './AddBudgetForm';
import { useParams } from 'react-router-dom';

export default function AddBudget() {
  let { idBudget } = useParams();
  return (
    <AddBudgetForm
      idBudget={idBudget}
      title={
        idBudget && idBudget > 0
          ? `Modifier le budget`
          : `Ajouter un budget`
      }
    />
  );
}
