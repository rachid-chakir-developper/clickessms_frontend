import { Box } from '@mui/material';
import BeneficiaryAbsences from './beneficiary-absences/BeneficiaryAbsences';
import TransmissionEvents from './transmission-events/TransmissionEvents';

import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';

export default function Activities() {
  return (
    <Box>
      <Routes>
        <Route path={`dashboard/*`} element={<Dashboard />} />
        <Route path={`evenements/*`} element={<TransmissionEvents />} />
        <Route
          path={`absences-beneficiaires/*`}
          element={<BeneficiaryAbsences />}
        />
        <Route path="/" element={<Navigate to={`dashboard`} replace />} />
      </Routes>
    </Box>
  );
}
