import Calls from './calls/Calls';

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
  
export default function Administratives() {

  return (
    <div className="calls">
      <Routes>
            <Route path={`appels/*`} element={<Calls />} />
            <Route
                path="/"
                element={<Navigate to={`appels`} replace />}
            />
      </Routes>
    </div>
  );
}
