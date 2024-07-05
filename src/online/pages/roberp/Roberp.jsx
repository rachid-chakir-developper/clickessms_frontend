import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import Feedbacks from './feedbacks/Feedbacks';

export default function Roberp() {
  return (
    <Box>
      <Routes>
        <Route
          path={`feedbacks/*`}
          element={<Feedbacks />}
        />
        <Route
          path="/"
          element={<Navigate to={`feedbacks`} replace />}
        />
      </Routes>
    </Box>
  );
}
