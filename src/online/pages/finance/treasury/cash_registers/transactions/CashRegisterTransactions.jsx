import { Routes, Route, Navigate } from 'react-router-dom';
import ListCashRegisterTransactions from './ListCashRegisterTransactions';
import AddCashRegisterTransaction from './AddCashRegisterTransaction';
import CashRegisterTransactionDetails from './CashRegisterTransactionDetails';
import { Box } from '@mui/material';

export default function CashRegisterTransactions() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListCashRegisterTransactions />} />
        <Route path={`ajouter`} element={<AddCashRegisterTransaction />} />
        <Route
          path={`modifier/:idCashRegisterTransaction`}
          element={<AddCashRegisterTransaction />}
        />
        <Route
          path={`details/:idCashRegisterTransaction`}
          element={<CashRegisterTransactionDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
