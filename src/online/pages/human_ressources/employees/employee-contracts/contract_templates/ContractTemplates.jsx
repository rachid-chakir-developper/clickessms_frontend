import { Routes, Route, Navigate } from 'react-router-dom';
import ListContractTemplates from './ListContractTemplates';
import AddContractTemplate from './AddContractTemplate';
import { Box } from '@mui/material';
import ContractTemplateDetails from './ContractTemplateDetails';

export default function ContractTemplates() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListContractTemplates />} />
        <Route path={`ajouter`} element={<AddContractTemplate />} />
        <Route path={`modifier/:idContractTemplate`} element={<AddContractTemplate />} />
        <Route path={`details/:idContractTemplate`} element={<ContractTemplateDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
