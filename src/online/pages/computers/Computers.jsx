import { Routes, Route, Navigate } from 'react-router-dom';

import { Box } from '@mui/material';import Materials from './materials/Materials';
import Softwares from './softwares/Softwares';
import TheBackups from './the_backups/TheBackups';
import ThePasswords from './the_passwords/ThePasswords';
import Tickets from './tickets/Tickets';
;

export default function Computers() {
  return (
    <Box>
      <Routes>
        <Route
          path={`materiels/*`}
          element={<Materials />}
        />
        <Route
          path={`logiciels/*`}
          element={<Softwares />}
        />
        <Route
          path={`tickets/*`}
          element={<Tickets />}
        />
        <Route
          path={`sauvegardes/*`}
          element={<TheBackups />}
        />
        <Route
          path={`mots-de-passe/*`}
          element={<ThePasswords />}
        />
        <Route
          path="/"
          element={<Navigate to={`materiels`} replace />}
        />
      </Routes>
    </Box>
  );
}
