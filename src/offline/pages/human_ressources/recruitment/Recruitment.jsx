

import { Routes, Route, Navigate } from 'react-router-dom';

import { Box } from '@mui/material';
import JobCandidateInformationSheets from './job_candidate_information_sheets/JobCandidateInformationSheets';

export default function Recruitment() {
  return (
    <Box>
      <Routes>
        <Route path={`fiche-renseignement/*`} element={<JobCandidateInformationSheets />} />
        <Route
          path="/"
          element={<Navigate to={`fiche-renseignement`} replace />}
        />
      </Routes>
    </Box>
  );
}
