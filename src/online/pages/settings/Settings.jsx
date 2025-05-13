import Company from './company/Company';
import Datas from './data_management/Datas';
import ListSettings from './ListSettings';

import { Routes, Route, Navigate } from 'react-router-dom';
import MessageNotifications from './message-notifications/MessageNotifications';
import CustomFields from './custom-forms/CustomFields';
import { Box } from '@mui/material';
import ValidationWorkflows from './validation-workflows/ValidationWorkflows';

export default function Settings() {
  return (
    <Box>
      <Routes>
        <Route path={``} element={<ListSettings />} />
        <Route path={`association/*`} element={<Company />} />
        <Route path={`listes-deroulantes/*`} element={<Datas />} />
        <Route path={`message-notifications/*`} element={<MessageNotifications />} />
        <Route path={`formulaires-personnalises/*`} element={<CustomFields />} />
        <Route path={`workflows/*`} element={<ValidationWorkflows />} />
        <Route path="/" element={<Navigate to={``} replace />} />
      </Routes>
    </Box>
  );
}
