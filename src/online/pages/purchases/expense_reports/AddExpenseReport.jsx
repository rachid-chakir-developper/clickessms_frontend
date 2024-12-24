import * as React from 'react';
import AddExpenseReportForm from './AddExpenseReportForm';
import { useParams } from 'react-router-dom';

export default function AddExpenseReport() {
  let { idExpenseReport } = useParams();
  return (
    <AddExpenseReportForm
      idExpenseReport={idExpenseReport}
      title={
        idExpenseReport && idExpenseReport > 0
          ? `Modifier la note de frais`
          : `Ajouter une note de frais`
      }
    />
  );
}
