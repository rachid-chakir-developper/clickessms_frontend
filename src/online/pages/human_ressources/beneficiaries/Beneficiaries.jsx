import { Routes, Route, Navigate } from 'react-router-dom';
import ListBeneficiaries from './ListBeneficiaries';
import AddBeneficiary from './AddBeneficiary';
import BeneficiaryDetails from './BeneficiaryDetails';
import BeneficiaryGroups from './beneficiary-groups/BeneficiaryGroup';

export default function Beneficiaries() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListBeneficiaries />} />
        <Route path={`ajouter`} element={<AddBeneficiary />} />
        <Route path={`modifier/:idBeneficiary`} element={<AddBeneficiary />} />
        <Route
          path={`details/:idBeneficiary`}
          element={<BeneficiaryDetails />}
        />
        <Route path={`groupes/*`} element={<BeneficiaryGroups />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
