import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material';
import Vehicles from './vehicles/Vehicles';
import VehicleInspections from './vehicle_Inspections/VehicleInspections';

export default function Parking() {
  return (
    <Box>
      <Routes>
        <Route path={`vehicules/*`} element={<Vehicles />} />
        <Route path={`controles-menssuels/*`} element={<VehicleInspections />} />
        <Route path="/" element={<Navigate to={`vehicules`} replace />} />
      </Routes>
    </Box>
  );
}
