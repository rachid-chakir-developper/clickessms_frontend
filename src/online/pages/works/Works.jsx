import { Box } from '@mui/material';
import ActionPlanActions from './actions/ActionPlanActions';
import Tasks from './tasks/Tasks';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Works() {
  return (
    <Box>
      <Routes>
        <Route path={`interventions/*`} element={<Tasks />} />
        <Route path={`actions/*`} element={<ActionPlanActions />} />
        <Route path="/" element={<Navigate to={`interventions`} replace />} />
      </Routes>
    </Box>
  );
}
