import { Routes, Route, Navigate } from 'react-router-dom';
import ListSoftwares from './ListSoftwares';
import AddSoftware from './AddSoftware';
import { Box } from '@mui/material';
import SoftwareDetails from './SoftwareDetails';

export default function Softwares() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListSoftwares />} />
        <Route path={`ajouter`} element={<AddSoftware />} />
        <Route path={`modifier/:idSoftware`} element={<AddSoftware />} />
        <Route path={`details/:idSoftware`} element={<SoftwareDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
