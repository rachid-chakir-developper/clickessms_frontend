import { Routes, Route, Navigate } from 'react-router-dom';
import ListSceMembers from './ListSceMembers';
import AddSceMember from './AddSceMember';
import SceMemberDetails from './SceMemberDetails';
import { Box } from '@mui/material';

export default function SceMembers() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListSceMembers />} />
        <Route path={`ajouter`} element={<AddSceMember />} />
        <Route path={`modifier/:idSceMember`} element={<AddSceMember />} />
        <Route path={`details/:idSceMember`} element={<SceMemberDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
