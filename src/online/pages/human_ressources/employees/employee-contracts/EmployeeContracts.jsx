import { Routes, Route, Navigate } from 'react-router-dom';
import ListEmployeeContracts from './ListEmployeeContracts';
import AddEmployeeContract from './AddEmployeeContract';
import EmployeeContractDetails from './EmployeeContractDetails';
import { Box } from '@mui/material';

export default function EmployeeContracts() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListEmployeeContracts />} />
        <Route path={`ajouter`} element={<AddEmployeeContract />} />
        <Route
          path={`modifier/:idEmployeeContract`}
          element={<AddEmployeeContract />}
        />
        <Route
          path={`details/:idEmployeeContract`}
          element={<EmployeeContractDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}