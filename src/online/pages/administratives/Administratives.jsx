import Calls from './calls/Calls';

import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Meetings from './meetings/Meetings';
import Letters from './letters/Letters';
import FrameDocuments from './frame_documents/FrameDocuments';

export default function Administratives() {
  return (
    <Box>
      <Routes>
        <Route path={`appels/*`} element={<Calls />} />
        <Route path={`courriers/*`} element={<Letters />} />
        <Route path={`reunions/*`} element={<Meetings />} />
        <Route path={`documents-trames/*`} element={<FrameDocuments />} />
        <Route path="/" element={<Navigate to={`appels`} replace />} />
      </Routes>
    </Box>
  );
}
