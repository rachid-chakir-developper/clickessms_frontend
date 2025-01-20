import { Routes, Route, Navigate } from 'react-router-dom';
import ListEndowments from './ListEndowments';
import AddEndowment from './AddEndowment';
import { Box } from '@mui/material';
import EndowmentDetails from './EndowmentDetails';

export default function Endowments() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListEndowments />} />
        <Route path={`ajouter`} element={<AddEndowment />} />
        <Route path={`modifier/:idEndowment`} element={<AddEndowment />} />
        <Route path={`details/:idEndowment`} element={<EndowmentDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
