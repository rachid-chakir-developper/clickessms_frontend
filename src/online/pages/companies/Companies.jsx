import { Box } from '@mui/material';
import Establishments from './establishments/Establishments';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Companies() {
  return (
    <Box>
      <Routes>
        <Route path={`structures/*`} element={<Establishments />} />
        <Route path="/" element={<Navigate to={`structures`} replace />} />
      </Routes>
    </Box>
  );
}
