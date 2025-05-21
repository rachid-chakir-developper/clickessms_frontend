import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import UndesirableEvents from './undesirable-events/UndesirableEvents';
import ActionPlan from './action-plan/ActionPlan';
import BoxIdeas from './box_ideas/BoxIdeas';
import Procedure from './procedure/Procedure';

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
          path={`boite-idees/*`}
          element={<BoxIdeas />}
        />
        <Route
          path={`procedure/*`}
          element={<Procedure />}
        />
        <Route
          path="/"
          element={<Navigate to={`evenements-indesirables`} replace />}
        />
      </Routes>
    </Box>
  );
}
