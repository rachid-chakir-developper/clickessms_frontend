
import { Routes, Route, Navigate } from 'react-router-dom';

import { Box } from '@mui/material';
import BankAccounts from './bank_accounts/BankAccounts';

export default function Treasury() {
  return (
    <Box>
      <Routes>
        <Route
          path={`comptes-bancaires/*`}
          element={<BankAccounts />}
        />
        <Route
          path="/"
          element={<Navigate to={`comptes-bancaires`} replace />}
        />
      </Routes>
    </Box>
  );
}
