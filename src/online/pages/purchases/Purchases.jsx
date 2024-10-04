import { Box } from '@mui/material';
import Suppliers from './suppliers/Suppliers';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Purchases() {
  return (
    <Box>
      <Routes>
        <Route path={`fournisseurs/*`} element={<Suppliers />} />
        <Route path="/" element={<Navigate to={`fournisseurs`} replace />} />
      </Routes>
    </Box>
  );
}
