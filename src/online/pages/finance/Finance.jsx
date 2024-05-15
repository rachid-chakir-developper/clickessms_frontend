import { Routes, Route, Navigate } from 'react-router-dom';

import { Box } from '@mui/material';
import DecisionDocuments from './decision_documents/DecisionDocuments';

export default function Finance() {
  return (
    <Box>
      <Routes>
        <Route
          path={`decisions/*`}
          element={<DecisionDocuments />}
        />
        <Route
          path="/"
          element={<Navigate to={`decisions`} replace />}
        />
      </Routes>
    </Box>
  );
}
