import Clients from './clients/Clients'

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
  
export default function Sales() {

  return (
    <div className="sales">
      <Routes>
            <Route path={`clients/*`} element={<Clients />} />
            <Route
                path="/"
                element={<Navigate to={`clients`} replace />}
            />
      </Routes>
    </div>
  );
}
