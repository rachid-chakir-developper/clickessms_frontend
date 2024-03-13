import Company from './company/Company'
import ListSettings from './ListSettings'

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
  
export default function Settings() {

  return (
    <div className="sales">
      <Routes>
            <Route path={``} element={<ListSettings />} />
            <Route path={`entreprise/*`} element={<Company />} />
            <Route
                path="/"
                element={<Navigate to={``} replace />}
            />
      </Routes>
    </div>
  );
}
