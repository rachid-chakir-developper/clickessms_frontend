import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Tickets from '../../works/tickets/Tickets';

export default function ActionPlan() {
  return (
    <Box>
      <Routes>
        <Route path={`tickets/*`} element={<Tickets />} />
        <Route path="/" element={<Navigate to={`tickets`} replace />} />
      </Routes>
    </Box>
  );
}
