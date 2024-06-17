import { Box } from '@mui/material';
import TaskActions from './actions/TaskActions';
import Tasks from './tasks/Tasks';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Works() {
  return (
    <Box>
      <Routes>
        <Route path={`interventions/*`} element={<Tasks />} />
        <Route path={`actions/*`} element={<TaskActions />} />
        <Route path="/" element={<Navigate to={`interventions`} replace />} />
      </Routes>
    </Box>
  );
}
