import BeneficiaryAbsences from './beneficiary-absences/BeneficiaryAbsences';
import Events from './events/Events';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Activities() {
  return (
    <div className="activites">
      <Routes>
        <Route path={`evenements/*`} element={<Events />} />
        <Route
          path={`absences-beneficiaires/*`}
          element={<BeneficiaryAbsences />}
        />
        <Route path="/" element={<Navigate to={`evenements`} replace />} />
      </Routes>
    </div>
  );
}
