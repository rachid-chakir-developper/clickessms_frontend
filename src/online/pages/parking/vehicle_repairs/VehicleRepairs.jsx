import { Routes, Route, Navigate } from 'react-router-dom';
import ListVehicleRepairs from './ListVehicleRepairs';
import AddVehicleRepair from './AddVehicleRepair';
import VehicleRepairDetails from './VehicleRepairDetails';

export default function VehicleRepairs() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListVehicleRepairs />} />
        <Route path={`ajouter`} element={<AddVehicleRepair />} />
        <Route
          path={`modifier/:idVehicleRepair`}
          element={<AddVehicleRepair />}
        />
        <Route
          path={`details/:idVehicleRepair`}
          element={<VehicleRepairDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
