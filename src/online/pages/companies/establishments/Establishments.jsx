import { Routes, Route, Navigate } from 'react-router-dom';
import ListEstablishments from './ListEstablishments';
import AddEstablishment from './AddEstablishment';
import EstablishmentDetails from './EstablishmentDetails';
import { Box } from '@mui/material';

export default function Establishments() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListEstablishments />} />
        <Route path={`liste/:idParent`} element={<ListEstablishments />} />
        <Route path={`ajouter`} element={<AddEstablishment />} />
        <Route
          path={`modifier/:idEstablishment`}
          element={<AddEstablishment />}
        />
        <Route
          path={`details/:idEstablishment`}
          element={<EstablishmentDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
