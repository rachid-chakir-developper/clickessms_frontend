import { Routes, Route, Navigate } from 'react-router-dom';
import GovernanceMembers from './governance-members/GovernanceMembers';
import { Box } from '@mui/material';
import Meetings from './meetings/Meetings';
import { useAuthorizationSystem } from '../../../_shared/context/AuthorizationSystemProvider';
import FrameDocuments from './frame_documents/FrameDocuments';

export default function Governance() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageGovernance = authorizationSystem.requestAuthorization({
    type: 'manageGovernance',
  }).authorized;
  return (
    <Box>
      <Routes>
        <Route path={`membres/*`} element={<GovernanceMembers />} />
        {canManageGovernance &&<Route path={`documents-trames/*`} element={<FrameDocuments />} />}
        {canManageGovernance && <Route path={`reunions/*`} element={<Meetings />} />}
        <Route path="/" element={<Navigate to={`membres`} replace />} />
      </Routes>
    </Box>
  );
}
