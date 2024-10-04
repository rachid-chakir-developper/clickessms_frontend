import { Box } from '@mui/material';
import EmployeeAbsences from './employee-absences/EmployeeAbsences'

import { Routes, Route, Navigate } from 'react-router-dom';
import Calendar from './calendar/Calendar';

export default function Planning() {
  return (
    <Box>
      <Routes>
        <Route
          path={`absences-employes/*`}
          element={<EmployeeAbsences />}
        />
        <Route
          path={`calendrier/*`}
          element={<Calendar />}
        />
        <Route path="/" element={<Navigate to={`calendrier`} replace />} />
      </Routes>
    </Box>
  );
}
