import Calls from './calls/Calls';

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Meetings from './meetings/Meetings';
import Letters from './letters/Letters';
  
export default function Administratives() {

  return (
    <div className="calls">
      <Routes>
            <Route path={`appels/*`} element={<Calls />} />
            <Route path={`courriers/*`} element={<Letters />} />
            <Route path={`reunions/*`} element={<Meetings />} />
            <Route
                path="/"
                element={<Navigate to={`appels`} replace />}
            />
      </Routes>
    </div>
  );
}
