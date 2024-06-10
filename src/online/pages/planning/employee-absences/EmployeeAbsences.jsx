import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ListEmployeeAbsences from './ListEmployeeAbsences';
import AddEmployeeAbsence from './AddEmployeeAbsence';
import EmployeeAbsenceDetails from './EmployeeAbsenceDetails';

export default function EmployeeAbsences() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListEmployeeAbsences />} />
        <Route path={`ajouter`} element={<AddEmployeeAbsence />} />
        <Route
          path={`modifier/:idEmployeeAbsence`}
          element={<AddEmployeeAbsence />}
        />
        <Route
          path={`details/:idEmployeeAbsence`}
          element={<EmployeeAbsenceDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
