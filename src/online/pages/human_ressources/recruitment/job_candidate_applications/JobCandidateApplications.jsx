import { Routes, Route, Navigate } from 'react-router-dom';
import ListJobCandidates from './ListJobCandidates';
import AddJobCandidate from './AddJobCandidate';
import JobCandidateDetails from './JobCandidateDetails';
import { Box } from '@mui/material';

export default function JobCandidates() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListJobCandidates />} />
        <Route path={`ajouter`} element={<AddJobCandidate />} />
        <Route
          path={`modifier/:idJobCandidate`}
          element={<AddJobCandidate />}
        />
        <Route
          path={`details/:idJobCandidate`}
          element={<JobCandidateDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
