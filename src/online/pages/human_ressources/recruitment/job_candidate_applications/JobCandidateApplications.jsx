import { Routes, Route, Navigate } from 'react-router-dom';
import ListJobCandidateApplications from './ListJobCandidateApplications';
import AddJobCandidateApplication from './AddJobCandidateApplication';
import JobCandidateApplicationDetails from './JobCandidateApplicationDetails';
import { Box } from '@mui/material';

export default function JobCandidateApplications() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListJobCandidateApplications />} />
        <Route path={`ajouter`} element={<AddJobCandidateApplication />} />
        <Route
          path={`modifier/:idJobCandidateApplication`}
          element={<AddJobCandidateApplication />}
        />
        <Route
          path={`details/:idJobCandidateApplication`}
          element={<JobCandidateApplicationDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
