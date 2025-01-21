import { Box } from '@mui/material';
import BeneficiaryAbsences from './beneficiary-absences/BeneficiaryAbsences';
import TransmissionEvents from './transmission-events/TransmissionEvents';

import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import PersonalizedProjects from './personalized_projects/PersonalizedProjects';
import BeneficiaryExpenses from './beneficiary_expenses/BeneficiaryExpenses';

export default function Activities() {
  return (
    <Box>
      <Routes>
        <Route path={`dashboard/*`} element={<Dashboard />} />
        <Route path={`projets-personnalises/*`} element={<PersonalizedProjects />} />
        <Route path={`evenements/*`} element={<TransmissionEvents />} />
        <Route
          path={`absences-beneficiaires/*`}
          element={<BeneficiaryAbsences />}
        />
        <Route
          path={`depenses/*`}
          element={<BeneficiaryExpenses />}
        />
        <Route path="/" element={<Navigate to={`dashboard`} replace />} />
      </Routes>
    </Box>
  );
}
