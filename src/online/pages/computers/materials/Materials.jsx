import { Routes, Route, Navigate } from 'react-router-dom';
import ListMaterials from './ListMaterials';
import AddMaterial from './AddMaterial';
import { Box } from '@mui/material';
import MaterialDetails from './MaterialDetails';

export default function Materials() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListMaterials />} />
        <Route path={`ajouter`} element={<AddMaterial />} />
        <Route path={`modifier/:idMaterial`} element={<AddMaterial />} />
        <Route path={`details/:idMaterial`} element={<MaterialDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
