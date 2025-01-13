import { Box } from '@mui/material';
import Clients from './clients/Clients';

import { Routes, Route, Navigate } from 'react-router-dom';
import Invoices from './invoices/Invoices';

export default function Sales() {
  return (
    <Box>
      <Routes>
        <Route path={`clients/*`} element={<Clients />} />
        <Route path={`factures/*`} element={<Invoices />} />
        <Route path="/" element={<Navigate to={`clients`} replace />} />
      </Routes>
    </Box>
  );
}
