import { Routes, Route, Navigate } from 'react-router-dom';
import ListJobCandidateInformationSheets from './ListJobCandidateInformationSheets';
import AddJobCandidateInformationSheet from './AddJobCandidateInformationSheet';
import JobCandidateInformationSheetDetails from './JobCandidateInformationSheetDetails';
import { Box } from '@mui/material';

export default function JobCandidateInformationSheets() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListJobCandidateInformationSheets />} />
        <Route path={`ajouter`} element={<AddJobCandidateInformationSheet />} />
        <Route
          path={`modifier/:idJobCandidateInformationSheet`}
          element={<AddJobCandidateInformationSheet />}
        />
        <Route
          path={`details/:idJobCandidateInformationSheet`}
          element={<JobCandidateInformationSheetDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
