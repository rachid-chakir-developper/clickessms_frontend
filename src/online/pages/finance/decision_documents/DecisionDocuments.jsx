import { Routes, Route, Navigate } from 'react-router-dom';
import ListDecisionDocuments from './ListDecisionDocuments';
import AddDecisionDocument from './AddDecisionDocument';
import { Box } from '@mui/material';

export default function DecisionDocuments() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListDecisionDocuments />} />
        <Route path={`ajouter`} element={<AddDecisionDocument />} />
        <Route path={`modifier/:idDecisionDocument`} element={<AddDecisionDocument />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
