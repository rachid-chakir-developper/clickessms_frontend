import { Routes, Route, Navigate } from 'react-router-dom';
import ListSceBenefits from './ListSceBenefits';
import AddSceBenefit from './AddSceBenefit';
import { Box } from '@mui/material';
import SceBenefitDetails from './SceBenefitDetails';

export default function SceBenefits() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListSceBenefits />} />
        <Route path={`ajouter`} element={<AddSceBenefit />} />
        <Route path={`modifier/:idSceBenefit`} element={<AddSceBenefit />} />
        <Route path={`details/:idSceBenefit`} element={<SceBenefitDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
