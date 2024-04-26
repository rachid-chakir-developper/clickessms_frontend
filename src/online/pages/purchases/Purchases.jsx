import Suppliers from './suppliers/Suppliers';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Purchases() {
  return (
    <div className="purchases">
      <Routes>
        <Route path={`fournisseurs/*`} element={<Suppliers />} />
        <Route path="/" element={<Navigate to={`fournisseurs`} replace />} />
      </Routes>
    </div>
  );
}
