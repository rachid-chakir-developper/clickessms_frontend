


import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import UndesirableEvents from "./undesirable-events/UndesirableEvents";
  
export default function Qualities() {

  return (
    <div className="qualities">
      <Routes>
            <Route path={`evenements-indesirables/*`} element={<UndesirableEvents />} />
            <Route
                path="/"
                element={<Navigate to={`evenements-indesirables`} replace />}
            />
      </Routes>
    </div>
  );
}
