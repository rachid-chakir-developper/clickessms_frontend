import { Routes, Route, Navigate } from 'react-router-dom';
import ListBankAccounts from './ListBankAccounts';
import AddBankAccount from './AddBankAccount';
import { Box } from '@mui/material';
import BankAccountDetails from './BankAccountDetails';

export default function BankAccounts() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListBankAccounts />} />
        <Route path={`ajouter`} element={<AddBankAccount />} />
        <Route path={`modifier/:idBankAccount`} element={<AddBankAccount />} />
        <Route path={`details/:idBankAccount`} element={<BankAccountDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
