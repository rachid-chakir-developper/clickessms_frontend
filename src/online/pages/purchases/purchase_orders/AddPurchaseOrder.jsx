import * as React from 'react';
import AddPurchaseOrderForm from './AddPurchaseOrderForm';
import { useParams } from 'react-router-dom';

export default function AddPurchaseOrder() {
  let { idPurchaseOrder } = useParams();
  return (
    <AddPurchaseOrderForm
      idPurchaseOrder={idPurchaseOrder}
      title={
        idPurchaseOrder && idPurchaseOrder > 0
          ? `Modifier le bon de commande`
          : `Ajouter un bon de commande`
      }
    />
  );
}
