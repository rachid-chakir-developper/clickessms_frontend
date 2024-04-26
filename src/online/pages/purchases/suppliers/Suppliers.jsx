import { Routes, Route, Navigate } from 'react-router-dom';
import ListSuppliers from './ListSuppliers';
import AddSupplier from './AddSupplier';
import SupplierDetails from './SupplierDetails';

export default function Suppliers() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListSuppliers />} />
        <Route path={`ajouter`} element={<AddSupplier />} />
        <Route path={`modifier/:idSupplier`} element={<AddSupplier />} />
        <Route path={`details/:idSupplier`} element={<SupplierDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
