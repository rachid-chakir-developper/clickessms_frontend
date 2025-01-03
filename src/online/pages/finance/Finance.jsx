import { Routes, Route, Navigate } from 'react-router-dom';

import { Box } from '@mui/material';
import DecisionDocuments from './decision_documents/DecisionDocuments';
import Treasury from './treasury/Treasury';
import Budgets from './budgets/Budgets';

export default function Finance() {
  return (
    <Box>
      <Routes>
        <Route
          path={`decisions/*`}
          element={<DecisionDocuments />}
        />
        <Route
          path={`budgets/*`}
          element={<Budgets />}
        />
        <Route
          path={`tresorerie/*`}
          element={<Treasury />}
        />
        <Route
          path="/"
          element={<Navigate to={`decisions`} replace />}
        />
      </Routes>
    </Box>
  );
}
