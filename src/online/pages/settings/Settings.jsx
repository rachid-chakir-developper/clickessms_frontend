import Company from './company/Company';
import Datas from './data_management/Datas';
import ListSettings from './ListSettings';

import { Routes, Route, Navigate } from 'react-router-dom';

export default function Settings() {
  return (
    <div className="sales">
      <Routes>
        <Route path={``} element={<ListSettings />} />
        <Route path={`entreprise/*`} element={<Company />} />
        <Route path={`listes-deroulantes/*`} element={<Datas />} />
        <Route path="/" element={<Navigate to={``} replace />} />
      </Routes>
    </div>
  );
}
