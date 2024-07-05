import { Routes, Route, Navigate } from 'react-router-dom';
import ListFeedbacks from './ListFeedbacks';
import AddFeedback from './AddFeedback';
import { Box } from '@mui/material';
import FeedbackDetails from './FeedbackDetails';

export default function Feedbacks() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListFeedbacks />} />
        <Route path={`ajouter`} element={<AddFeedback />} />
        <Route path={`modifier/:idFeedback`} element={<AddFeedback />} />
        <Route path={`details/:idFeedback`} element={<FeedbackDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
