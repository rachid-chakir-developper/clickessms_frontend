import { Routes, Route, Navigate } from 'react-router-dom';
import GovernanceMembers from './governance-members/GovernanceMembers';
import { Box } from '@mui/material';
import Meetings from './meetings/Meetings';
import { useAuthorizationSystem } from '../../../_shared/context/AuthorizationSystemProvider';
import FrameDocuments from './frame_documents/FrameDocuments';

export default function Governance() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageGovernanceModules = authorizationSystem.requestAuthorization({
    type: 'manageGovernanceModules',
  }).authorized;
  return (
    <Box>
      <Routes>
        <Route path={`membres/*`} element={<GovernanceMembers />} />
        {canManageGovernanceModules &&<Route path={`documents-trames/*`} element={<FrameDocuments />} />}
        {canManageGovernanceModules && <Route path={`reunions/*`} element={<Meetings />} />}
        <Route path="/" element={<Navigate to={`membres`} replace />} />
      </Routes>
    </Box>
  );
}
