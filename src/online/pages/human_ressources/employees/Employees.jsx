import { Routes, Route, Navigate } from 'react-router-dom';
import ListEmployees from './ListEmployees';
import AddEmployee from './AddEmployee';
import EmployeeDetails from './EmployeeDetails';
import EmployeeGroups from './employee-groups/EmployeeGroup';
import EmployeeContracts from './employee-contracts/EmployeeContracts';
import { Box } from '@mui/material';

export default function Employees() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListEmployees />} />
        <Route path={`ajouter`} element={<AddEmployee />} />
        <Route path={`modifier/:idEmployee`} element={<AddEmployee />} />
        <Route path={`details/:idEmployee`} element={<EmployeeDetails />} />
        <Route path={`groupes/*`} element={<EmployeeGroups />} />
        <Route path={`contrats/*`} element={<EmployeeContracts />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
