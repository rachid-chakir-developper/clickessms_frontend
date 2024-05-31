import { Routes, Route, Navigate } from 'react-router-dom';
import ListVehicleInspections from './ListVehicleInspections';
import AddVehicleInspection from './AddVehicleInspection';
import VehicleInspectionDetails from './VehicleInspectionDetails';

export default function VehicleInspections() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListVehicleInspections />} />
        <Route path={`ajouter`} element={<AddVehicleInspection />} />
        <Route
          path={`modifier/:idVehicleInspection`}
          element={<AddVehicleInspection />}
        />
        <Route
          path={`details/:idVehicleInspection`}
          element={<VehicleInspectionDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
