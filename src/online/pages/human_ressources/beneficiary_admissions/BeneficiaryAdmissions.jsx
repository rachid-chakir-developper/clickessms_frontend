import { Routes, Route, Navigate } from 'react-router-dom';
import ListBeneficiaryAdmissions from './ListBeneficiaryAdmissions';
import AddBeneficiaryAdmission from './AddBeneficiaryAdmission';
import BeneficiaryAdmissionDetails from './BeneficiaryAdmissionDetails';
import { Box } from '@mui/material';

export default function BeneficiaryAdmissions() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListBeneficiaryAdmissions />} />
        <Route path={`ajouter`} element={<AddBeneficiaryAdmission />} />
        <Route path={`modifier/:idBeneficiaryAdmission`} element={<AddBeneficiaryAdmission />} />
        <Route path={`details/:idBeneficiaryAdmission`} element={<BeneficiaryAdmissionDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
