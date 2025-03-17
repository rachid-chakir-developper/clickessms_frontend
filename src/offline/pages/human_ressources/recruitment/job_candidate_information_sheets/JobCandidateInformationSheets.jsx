import { Routes, Route, Navigate } from 'react-router-dom';
import AddJobCandidateInformationSheet from './AddJobCandidateInformationSheet';
import { Box } from '@mui/material';

export default function JobCandidateInformationSheets() {
  return (
    <Box>
      <Routes>
        <Route
          path={`/:accessToken`}
          element={<AddJobCandidateInformationSheet />}
        />
      </Routes>
    </Box>
  );
}
