import { Routes, Route, Navigate } from 'react-router-dom';
import ListVehicles from './ListVehicles';
import AddVehicle from './AddVehicle';
import VehicleDetails from './VehicleDetails';

export default function Vehicles() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListVehicles />} />
        <Route path={`ajouter`} element={<AddVehicle />} />
        <Route path={`modifier/:idVehicle`} element={<AddVehicle />} />
        <Route path={`details/:idVehicle`} element={<VehicleDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
