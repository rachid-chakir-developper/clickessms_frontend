import { Box } from '@mui/material';
import EmployeeAbsences from './employee-absences/EmployeeAbsences'

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Planning() {
  return (
    <Box>
      <Routes>
        <Route
          path={`absences-employes/*`}
          element={<EmployeeAbsences />}
        />
        <Route path="/" element={<Navigate to={`absences-employes`} replace />} />
      </Routes>
    </Box>
  );
}
