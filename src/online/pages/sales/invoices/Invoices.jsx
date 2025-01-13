import { Routes, Route, Navigate } from 'react-router-dom';
import ListInvoices from './ListInvoices';
import AddInvoice from './AddInvoice';
import { Box } from '@mui/material';

export default function Invoices() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListInvoices />} />
        <Route path={`ajouter`} element={<AddInvoice />} />
        <Route path={`modifier/:idInvoice`} element={<AddInvoice />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
