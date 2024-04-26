import Establishments from './establishments/Establishments';
import EstablishmentServices from './services/EstablishmentServices';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Companies() {
  return (
    <div className="associations">
      <Routes>
        <Route path={`etablissements/*`} element={<Establishments />} />
        <Route path={`services/*`} element={<EstablishmentServices />} />
        <Route path="/" element={<Navigate to={`etablissements`} replace />} />
      </Routes>
    </div>
  );
}
