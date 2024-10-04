import { Routes, Route, Navigate } from 'react-router-dom';
import Beneficiaries from './beneficiaries/Beneficiaries';
import Employees from './employees/Employees';
import { Box } from '@mui/material';
import Planning from '../planning/Planning';

export default function Humans() {
  return (
    <Box>
      <Routes>
        <Route path={`beneficiaires/*`} element={<Beneficiaries />} />
        <Route path={`employes/*`} element={<Employees />} />
        <Route path={`planning/*`} element={<Planning />} />
        <Route path="/" element={<Navigate to={`employes`} replace />} />
      </Routes>
    </Box>
  );
}
