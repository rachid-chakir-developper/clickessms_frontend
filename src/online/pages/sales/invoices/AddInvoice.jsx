import * as React from 'react';
import AddInvoiceForm from './AddInvoiceForm';
import { useParams } from 'react-router-dom';

export default function AddInvoice() {
  let { idInvoice } = useParams();
  return (
    <AddInvoiceForm
      idInvoice={idInvoice}
      title={
        idInvoice && idInvoice > 0
          ? `Facture`
          : `Facture`
      }
    />
  );
}
