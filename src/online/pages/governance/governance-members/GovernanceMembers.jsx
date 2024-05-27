import { Routes, Route, Navigate } from 'react-router-dom';
import ListGovernanceMembers from './ListGovernanceMembers';
import AddGovernanceMember from './AddGovernanceMember';
import GovernanceMemberDetails from './GovernanceMemberDetails';
import { Box } from '@mui/material';

export default function GovernanceMembers() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListGovernanceMembers />} />
        <Route path={`ajouter`} element={<AddGovernanceMember />} />
        <Route path={`modifier/:idGovernanceMember`} element={<AddGovernanceMember />} />
        <Route path={`details/:idGovernanceMember`} element={<GovernanceMemberDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
