import { Routes, Route, Navigate } from 'react-router-dom';
import ListFinanciers from './ListFinanciers';
import AddFinancier from './AddFinancier';
import FinancierDetails from './FinancierDetails';

export default function Financiers() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListFinanciers />} />
        <Route path={`ajouter`} element={<AddFinancier />} />
        <Route path={`modifier/:idFinancier`} element={<AddFinancier />} />
        <Route path={`details/:idFinancier`} element={<FinancierDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
