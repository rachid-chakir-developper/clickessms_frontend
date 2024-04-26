import TheObjects from './the_objects/TheObjects';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Loans() {
  return (
    <div className="recuperation">
      <Routes>
        <Route path={`objets/*`} element={<TheObjects />} />
        <Route path="/" element={<Navigate to={`objets`} replace />} />
      </Routes>
    </div>
  );
}
