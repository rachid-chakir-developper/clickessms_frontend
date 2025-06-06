import { Routes, Route, Navigate } from 'react-router-dom';
import ListBeneficiaries from './ListBeneficiaries';
import AddBeneficiary from './AddBeneficiary';
import BeneficiaryDetails from './BeneficiaryDetails';
import BeneficiaryGroups from './beneficiary-groups/BeneficiaryGroup';
import { Box } from '@mui/material';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';

export default function Beneficiaries() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageActivity = authorizationSystem.requestAuthorization({
    type: 'manageActivity',
  }).authorized;
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListBeneficiaries />} />
        {canManageActivity && <Route path={`ajouter`} element={<AddBeneficiary />} />}
        <Route path={`modifier/:idBeneficiary`} element={<AddBeneficiary />} />
        <Route
          path={`details/:idBeneficiary`}
          element={<BeneficiaryDetails />}
        />
        <Route path={`groupes/*`} element={<BeneficiaryGroups />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
