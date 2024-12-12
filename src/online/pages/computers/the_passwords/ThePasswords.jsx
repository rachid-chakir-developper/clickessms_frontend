import { Routes, Route, Navigate } from 'react-router-dom';
import ListThePasswords from './ListThePasswords';
import AddThePassword from './AddThePassword';
import { Box } from '@mui/material';
import ThePasswordDetails from './ThePasswordDetails';

export default function ThePasswords() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListThePasswords />} />
        <Route path={`ajouter`} element={<AddThePassword />} />
        <Route path={`modifier/:idThePassword`} element={<AddThePassword />} />
        <Route path={`details/:idThePassword`} element={<ThePasswordDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
