import { Routes, Route, Navigate } from 'react-router-dom';
import ListBankCards from './ListBankCards';
import AddBankCard from './AddBankCard';
import BankCardDetails from './BankCardDetails';
import { Box } from '@mui/material';

export default function BankCards() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListBankCards />} />
        <Route path={`ajouter`} element={<AddBankCard />} />
        <Route
          path={`modifier/:idBankCard`}
          element={<AddBankCard />}
        />
        <Route
          path={`details/:idBankCard`}
          element={<BankCardDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
