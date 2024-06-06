import { Routes, Route, Navigate } from 'react-router-dom';
import ListVehicleTechnicalInspections from './ListVehicleTechnicalInspections';
import AddVehicleTechnicalInspection from './AddVehicleTechnicalInspection';
import VehicleTechnicalInspectionDetails from './VehicleTechnicalInspectionDetails';

export default function VehicleTechnicalInspections() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListVehicleTechnicalInspections />} />
        <Route path={`ajouter`} element={<AddVehicleTechnicalInspection />} />
        <Route
          path={`modifier/:idVehicleTechnicalInspection`}
          element={<AddVehicleTechnicalInspection />}
        />
        <Route
          path={`details/:idVehicleTechnicalInspection`}
          element={<VehicleTechnicalInspectionDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
