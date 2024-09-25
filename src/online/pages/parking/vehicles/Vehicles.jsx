import { Routes, Route, Navigate } from 'react-router-dom';
import ListVehicles from './ListVehicles';
import AddVehicle from './AddVehicle';
import VehicleDetails from './VehicleDetails';
import { Box } from '@mui/material';

export default function Vehicles() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListVehicles />} />
        <Route path={`ajouter`} element={<AddVehicle />} />
        <Route path={`modifier/:idVehicle`} element={<AddVehicle />} />
        <Route path={`details/:idVehicle`} element={<VehicleDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
