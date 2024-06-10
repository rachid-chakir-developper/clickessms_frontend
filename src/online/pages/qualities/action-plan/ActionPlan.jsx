import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import ActionPlanObjectives from './objectives/ActionPlanObjectives';

export default function ActionPlan() {
  return (
    <Box>
      <Routes>
        <Route path={`objectifs/*`} element={<ActionPlanObjectives />} />
        <Route path="/" element={<Navigate to={`objectifs`} replace />} />
      </Routes>
    </Box>
  );
}
