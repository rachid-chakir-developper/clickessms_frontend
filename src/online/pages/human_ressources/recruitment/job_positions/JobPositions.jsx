import { Routes, Route, Navigate } from 'react-router-dom';
import ListJobPositions from './ListJobPositions';
import AddJobPosition from './AddJobPosition';
import JobPositionDetails from './JobPositionDetails';
import { Box } from '@mui/material';

export default function JobPositions() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListJobPositions />} />
        <Route path={`ajouter`} element={<AddJobPosition />} />
        <Route
          path={`modifier/:idJobPosition`}
          element={<AddJobPosition />}
        />
        <Route
          path={`details/:idJobPosition`}
          element={<JobPositionDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
