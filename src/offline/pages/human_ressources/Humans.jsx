import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Recruitment from './recruitment/Recruitment';

export default function Humans() {
  return (
    <Box>
      <Routes>
        <Route path={`recrutement/*`} element={<Recruitment />} />
        <Route path="/" element={<Navigate to={`recrutement`} replace />} />
      </Routes>
    </Box>
  );
}
