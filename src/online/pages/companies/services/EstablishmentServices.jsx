import { Routes, Route, Navigate } from 'react-router-dom';
import ListEstablishmentServices from './ListEstablishmentServices';
import AddEstablishmentService from './AddEstablishmentService';
import EstablishmentServiceDetails from './EstablishmentServiceDetails';

export default function EstablishmentServices() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListEstablishmentServices />} />
        <Route path={`ajouter`} element={<AddEstablishmentService />} />
        <Route
          path={`modifier/:idEstablishmentService`}
          element={<AddEstablishmentService />}
        />
        <Route
          path={`details/:idEstablishmentService`}
          element={<EstablishmentServiceDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
