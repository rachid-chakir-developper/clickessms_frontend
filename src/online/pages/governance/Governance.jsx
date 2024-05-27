import { Routes, Route, Navigate } from 'react-router-dom';
import GovernanceMembers from './governance-members/GovernanceMembers';
import { Box } from '@mui/material';
import Meetings from './meetings/Meetings';

export default function Governance() {
  return (
    <Box>
      <Routes>
        <Route path={`membres/*`} element={<GovernanceMembers />} />
        <Route path={`reunions/*`} element={<Meetings />} />
        <Route path="/" element={<Navigate to={`membres`} replace />} />
      </Routes>
    </Box>
  );
}
