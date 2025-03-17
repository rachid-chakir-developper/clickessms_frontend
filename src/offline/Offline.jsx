import * as React from 'react';
import { Box } from '@mui/material';
import SignInSide from './pages/SignInSide';
import SignUp from './pages/SignUp';

import { Routes, Route, Navigate } from 'react-router-dom';
import Humans from './pages/human_ressources/Humans';
import AuthGuardRoute from '../_shared/guards/AuthGuardRoute';

export default function Offline() {
  return (
    <Box>
      <Routes>
        <Route path={`login`} element={
            <AuthGuardRoute guest>
              <SignInSide />
            </AuthGuardRoute>
          }
        />
        <Route path={`register`} element={
            <AuthGuardRoute guest>
              <SignUp />
            </AuthGuardRoute>
          }
        />
        <Route path={`ressources-humaines/*`} element={<Humans />}/>
        <Route path="/" element={<Navigate to={`login`} replace />} />
      </Routes>
    </Box>
  );
}
