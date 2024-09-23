import { Routes, Route, Navigate } from 'react-router-dom';
import ListMessageNotifications from './ListMessageNotifications';
import AddMessageNotification from './AddMessageNotification';
import { Box } from '@mui/material';
import MessageNotificationDetails from './MessageNotificationDetails';

export default function MessageNotifications() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListMessageNotifications />} />
        <Route path={`ajouter`} element={<AddMessageNotification />} />
        <Route path={`modifier/:idMessageNotification`} element={<AddMessageNotification />} />
        <Route path={`details/:idMessageNotification`} element={<MessageNotificationDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
