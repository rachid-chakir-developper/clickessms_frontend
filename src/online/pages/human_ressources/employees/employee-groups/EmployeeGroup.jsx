import { Routes, Route, Navigate } from 'react-router-dom';
import ListEmployeeGroups from './ListEmployeeGroups';
import AddEmployeeGroup from './AddEmployeeGroup';
import EmployeeGroupDetails from './EmployeeGroupDetails';
import { Box } from '@mui/material';

export default function EmployeeGroups() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListEmployeeGroups />} />
        <Route path={`ajouter`} element={<AddEmployeeGroup />} />
        <Route
          path={`modifier/:idEmployeeGroup`}
          element={<AddEmployeeGroup />}
        />
        <Route
          path={`details/:idEmployeeGroup`}
          element={<EmployeeGroupDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
