import { Routes, Route, Navigate } from 'react-router-dom';
import ListBalances from './ListBalances';
import AddBalance from './AddBalance';
import BalanceDetails from './BalanceDetails';
import { Box } from '@mui/material';

export default function Balances() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListBalances />} />
        <Route path={`ajouter`} element={<AddBalance />} />
        <Route
          path={`modifier/:idBalance`}
          element={<AddBalance />}
        />
        <Route
          path={`details/:idBalance`}
          element={<BalanceDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
