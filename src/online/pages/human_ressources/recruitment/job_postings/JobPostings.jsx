import { Routes, Route, Navigate } from 'react-router-dom';
import ListJobPostings from './ListJobPostings';
import AddJobPosting from './AddJobPosting';
import JobPostingDetails from './JobPostingDetails';
import { Box } from '@mui/material';

export default function JobPostings() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListJobPostings />} />
        <Route path={`ajouter`} element={<AddJobPosting />} />
        <Route
          path={`modifier/:idJobPosting`}
          element={<AddJobPosting />}
        />
        <Route
          path={`details/:idJobPosting`}
          element={<JobPostingDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
