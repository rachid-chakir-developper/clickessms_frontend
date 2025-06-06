import { Routes, Route, Navigate } from 'react-router-dom';
import Beneficiaries from './beneficiaries/Beneficiaries';
import Employees from './employees/Employees';
import { Box } from '@mui/material';
import Planning from '../planning/Planning';
import Meetings from './meetings/Meetings';
import EmployeeContracts from './employees/employee-contracts/EmployeeContracts';
import BeneficiaryAdmissions from './beneficiary_admissions/BeneficiaryAdmissions';
import Recruitment from './recruitment/Recruitment';
import { useAuthorizationSystem } from '../../../_shared/context/AuthorizationSystemProvider';
import Advances from './advances/Advances';

export default function Humans() {
  const authorizationSystem = useAuthorizationSystem();
    const canManageHumanRessources = authorizationSystem.requestAuthorization({
      type: 'manageHumanRessources',
    }).authorized;
  return (
    <Box>
      <Routes>
        <Route path={`cr-entretiens/*`} element={<Meetings />} />
        <Route path={`beneficiaires/*`} element={<Beneficiaries />} />
        <Route path={`admissions-beneficiaires/*`} element={<BeneficiaryAdmissions />} />
        <Route path={`employes/*`} element={<Employees />} />
        <Route path={`contrats/*`} element={<EmployeeContracts />} />
        <Route path={`planning/*`} element={<Planning />} />
        {canManageHumanRessources && <Route path={`recrutement/*`} element={<Recruitment />} />}
        <Route path={`acomptes/*`} element={<Advances />} />
        <Route path="/" element={<Navigate to={`reunions`} replace />} />
      </Routes>
    </Box>
  );
}
