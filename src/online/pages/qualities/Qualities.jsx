import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import UndesirableEvents from './undesirable-events/UndesirableEvents';
import ActionPlan from './action-plan/ActionPlan';

export default function Qualities() {
  return (
    <Box>
      <Routes>
        <Route
          path={`evenements-indesirables/*`}
          element={<UndesirableEvents />}
        />
        <Route
          path={`plan-action/*`}
          element={<ActionPlan />}
        />
        <Route
          path="/"
          element={<Navigate to={`evenements-indesirables`} replace />}
        />
      </Routes>
    </Box>
  );
}
