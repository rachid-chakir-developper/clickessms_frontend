import * as React from 'react';
import { Box } from '@mui/material';

import { Routes, Route, Navigate } from 'react-router-dom';
import ChangePassword from './ChangePassword';

export default function Auth() {
  return (
    <Box>
      <Routes>
        <Route path={`changer-mot-de-passe`} element={<ChangePassword />}/>
        <Route path="/" element={<Navigate to={`changer-mot-de-passe`} replace />} />
      </Routes>
    </Box>
  );
}
