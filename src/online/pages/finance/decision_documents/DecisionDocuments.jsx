import { Routes, Route, Navigate } from 'react-router-dom';
import ListDecisionDocuments from './ListDecisionDocuments';
import AddDecisionDocument from './AddDecisionDocument';
import DecisionDocumentDetails from './DecisionDocumentDetails';
import { Box } from '@mui/material';

export default function DecisionDocuments() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListDecisionDocuments />} />
        <Route path={`ajouter`} element={<AddDecisionDocument />} />
        <Route path={`modifier/:idDecisionDocument`} element={<AddDecisionDocument />} />
        <Route path={`details/:idDecisionDocument`} element={<DecisionDocumentDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
