import { Routes, Route, Navigate } from 'react-router-dom';
import ListPurchaseOrders from './ListPurchaseOrders';
import AddPurchaseOrder from './AddPurchaseOrder';
import PurchaseOrderDetails from './PurchaseOrderDetails';
import { Box } from '@mui/material';

export default function PurchaseOrders() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListPurchaseOrders />} />
        <Route path={`ajouter`} element={<AddPurchaseOrder />} />
        <Route path={`modifier/:idPurchaseOrder`} element={<AddPurchaseOrder />} />
        <Route path={`details/:idPurchaseOrder`} element={<PurchaseOrderDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
