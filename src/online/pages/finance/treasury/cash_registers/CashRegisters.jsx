import { Routes, Route, Navigate } from 'react-router-dom';
import ListCashRegisters from './ListCashRegisters';
import AddCashRegister from './AddCashRegister';
import CashRegisterDetails from './CashRegisterDetails';
import { Box } from '@mui/material';

export default function CashRegisters() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListCashRegisters />} />
        <Route path={`ajouter`} element={<AddCashRegister />} />
        <Route
          path={`modifier/:idCashRegister`}
          element={<AddCashRegister />}
        />
        <Route
          path={`details/:idCashRegister`}
          element={<CashRegisterDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
