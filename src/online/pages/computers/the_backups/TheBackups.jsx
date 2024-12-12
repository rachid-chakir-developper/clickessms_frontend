import { Routes, Route, Navigate } from 'react-router-dom';
import ListTheBackups from './ListTheBackups';
import AddTheBackup from './AddTheBackup';
import { Box } from '@mui/material';
import TheBackupDetails from './TheBackupDetails';

export default function TheBackups() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListTheBackups />} />
        <Route path={`ajouter`} element={<AddTheBackup />} />
        <Route path={`modifier/:idTheBackup`} element={<AddTheBackup />} />
        <Route path={`details/:idTheBackup`} element={<TheBackupDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
