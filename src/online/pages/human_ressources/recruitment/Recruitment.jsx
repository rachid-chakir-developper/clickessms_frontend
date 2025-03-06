

import { Routes, Route, Navigate } from 'react-router-dom';

import { Box } from '@mui/material';
import JobPositions from './job_positions/JobPositions';
import JobCandidates from './job_candidates/JobCandidates';

export default function Recruitment() {
  return (
    <Box>
      <Routes>
        <Route path={`fiches-besoin/*`} element={<JobPositions />} />
        <Route path={`vivier-candidats/*`} element={<JobCandidates />} />
        <Route
          path="/"
          element={<Navigate to={`fiches-besoin`} replace />}
        />
      </Routes>
    </Box>
  );
}
