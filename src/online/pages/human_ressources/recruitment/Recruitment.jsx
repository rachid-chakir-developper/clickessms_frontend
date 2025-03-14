

import { Routes, Route, Navigate } from 'react-router-dom';

import { Box } from '@mui/material';
import JobPositions from './job_positions/JobPositions';
import JobCandidates from './job_candidates/JobCandidates';
import JobPostings from './job_postings/JobPostings';
import Meetings from './meetings/Meetings';
import JobCandidateApplications from './job_candidate_applications/JobCandidateApplications';
import JobCandidateInformationSheets from './job_candidate_information_sheets/JobCandidateInformationSheets';

export default function Recruitment() {
  return (
    <Box>
      <Routes>
        <Route path={`fiches-besoin/*`} element={<JobPositions />} />
        <Route path={`annonces/*`} element={<JobPostings />} />
        <Route path={`vivier-candidats/*`} element={<JobCandidates />} />
        <Route path={`candidatures/*`} element={<JobCandidateApplications />} />
        <Route path={`entretiens/*`} element={<Meetings />} />
        <Route path={`fiches-renseignement/*`} element={<JobCandidateInformationSheets />} />
        <Route
          path="/"
          element={<Navigate to={`fiches-besoin`} replace />}
        />
      </Routes>
    </Box>
  );
}
