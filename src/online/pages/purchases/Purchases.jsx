import { Box } from '@mui/material';
import Suppliers from './suppliers/Suppliers';

import { Routes, Route, Navigate } from 'react-router-dom';
import Expenses from './expenses/Expenses';
import PurchaseOrders from './purchase_orders/PurchaseOrders';
import PurchaseContracts from './purchase_contracts/PurchaseContracts';
import ExpenseReports from './expense_reports/ExpenseReports';

export default function Purchases() {
  return (
    <Box>
      <Routes>
        <Route path={`fournisseurs/*`} element={<Suppliers />} />
        <Route path={`depenses-engagements/*`} element={<Expenses />} />
        <Route path={`bons-commandes/*`} element={<PurchaseOrders />} />
        <Route path={`notes-frais/*`} element={<ExpenseReports />} />
        <Route path={`base-contrats/*`} element={<PurchaseContracts />} />
        <Route path="/" element={<Navigate to={`depenses-engagements`} replace />} />
      </Routes>
    </Box>
  );
}
