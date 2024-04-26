import Partners from './partners/Partners';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Partnerships() {
  return (
    <div className="partnerships">
      <Routes>
        <Route path={`partenaires/*`} element={<Partners />} />
        <Route path="/" element={<Navigate to={`partenaires`} replace />} />
      </Routes>
    </div>
  );
}
