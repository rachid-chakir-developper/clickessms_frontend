
import { Routes, Route, Navigate } from 'react-router-dom';

import { Box } from '@mui/material';
import BankAccounts from './bank_accounts/BankAccounts';
import Balances from './balances/Balances';

export default function Treasury() {
  return (
    <Box>
      <Routes>
        <Route path={`comptes-bancaires/*`} element={<BankAccounts />} />
        <Route path={`soldes/*`} element={<Balances />} />
        <Route
          path="/"
          element={<Navigate to={`comptes-bancaires`} replace />}
        />
      </Routes>
    </Box>
  );
}
