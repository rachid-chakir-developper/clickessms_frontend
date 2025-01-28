import { Box } from '@mui/material';
import Financiers from './financiers/Financiers';
import Partners from './partners/Partners';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Partnerships() {
  return (
    <Box>
      <Routes>
        <Route path={`partenaires/*`} element={<Partners />} />
        <Route path={`financeurs/*`} element={<Financiers />} />
        <Route path="/" element={<Navigate to={`partenaires`} replace />} />
      </Routes>
    </Box>
  );
}
