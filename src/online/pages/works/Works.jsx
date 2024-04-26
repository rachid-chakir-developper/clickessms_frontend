import Tasks from './tasks/Tasks';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Works() {
  return (
    <div className="sales">
      <Routes>
        <Route path={`interventions/*`} element={<Tasks />} />
        <Route path="/" element={<Navigate to={`interventions`} replace />} />
      </Routes>
    </div>
  );
}
