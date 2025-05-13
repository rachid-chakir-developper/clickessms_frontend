import { Routes, Route, Navigate } from 'react-router-dom';
import ListValidationWorkflows from './ListValidationWorkflows';
import AddValidationWorkflow from './AddValidationWorkflow';
import ValidationWorkflowDetails from './ValidationWorkflowDetails';
import { Box } from '@mui/material';

export default function ValidationWorkflows() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListValidationWorkflows />} />
        <Route path={`ajouter`} element={<AddValidationWorkflow />} />
        <Route path={`modifier/:idValidationWorkflow`} element={<AddValidationWorkflow />} />
        <Route path={`details/:idValidationWorkflow`} element={<ValidationWorkflowDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
