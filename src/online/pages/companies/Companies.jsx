import { Box } from '@mui/material';
import Establishments from './establishments/Establishments';

import { Routes, Route, Navigate } from 'react-router-dom';
import AddCompany from './AddCompany';
import ListCompanies from './ListCompanies';

export default function Companies() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListCompanies />} />
        <Route path={`ajouter`} element={<AddCompany />} />
        <Route path={`modifier/:idCompany`} element={<AddCompany />} />
        <Route path={`structures/*`} element={<Establishments />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
