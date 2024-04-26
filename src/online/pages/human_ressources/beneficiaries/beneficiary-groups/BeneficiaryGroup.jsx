import { Routes, Route, Navigate } from 'react-router-dom';
import ListBeneficiaryGroups from './ListBeneficiaryGroups';
import AddBeneficiaryGroup from './AddBeneficiaryGroup';
import BeneficiaryGroupDetails from './BeneficiaryGroupDetails';

export default function BeneficiaryGroups() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListBeneficiaryGroups />} />
        <Route path={`ajouter`} element={<AddBeneficiaryGroup />} />
        <Route
          path={`modifier/:idBeneficiaryGroup`}
          element={<AddBeneficiaryGroup />}
        />
        <Route
          path={`details/:idBeneficiaryGroup`}
          element={<BeneficiaryGroupDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
