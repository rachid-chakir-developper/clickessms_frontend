import { Routes, Route, Navigate } from 'react-router-dom';
import ListEndowmentPayments from './ListEndowmentPayments';
import AddEndowmentPayment from './AddEndowmentPayment';
import { Box } from '@mui/material';
import EndowmentPaymentDetails from './EndowmentPaymentDetails';

export default function EndowmentPayments() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListEndowmentPayments />} />
        <Route path={`ajouter`} element={<AddEndowmentPayment />} />
        <Route path={`modifier/:idEndowmentPayment`} element={<AddEndowmentPayment />} />
        <Route path={`details/:idEndowmentPayment`} element={<EndowmentPaymentDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
