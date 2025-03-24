import { Routes, Route, Navigate } from 'react-router-dom';
import SceMembers from './sce-members/SceMembers';
import { Box } from '@mui/material';
import Meetings from './meetings/Meetings';
import MessageNotifications from './message-notifications/MessageNotifications';
import SceBenefits from './sce-benefit/SceBenefits';
import Posts from './posts/Posts';

export default function Sce() {
  return (
    <Box>
      <Routes>
        <Route path={`membres/*`} element={<SceMembers />} />
        <Route path={`reunions/*`} element={<Meetings />} />
        <Route path={`notifications-messages/*`} element={<MessageNotifications />} />
        <Route path={`avantages/*`} element={<SceBenefits />} />
        <Route path={`articles/*`} element={<Posts />} />
        <Route path="/" element={<Navigate to={`membres`} replace />} />
      </Routes>
    </Box>
  );
}
