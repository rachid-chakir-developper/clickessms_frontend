import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TableListAdvances from './TableListAdvances';
import AdvanceDetails from './AdvanceDetails';
import AddAdvance from './AddAdvance';
import EditAdvance from './EditAdvance';

export default function Advances() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<Navigate to="liste" replace />} />
        <Route path="liste" element={<TableListAdvances />} />
        <Route path="ajouter" element={<AddAdvance />} />
        <Route path="modifier/:idAdvance" element={<EditAdvance />} />
        <Route path="details/:idAdvance" element={<AdvanceDetails />} />
      </Routes>
    </Box>
  );
} 