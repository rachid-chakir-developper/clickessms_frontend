

import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import CompanySetting from "./CompanySetting";
    
  export default function Tasks() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={``} element={<CompanySetting />} />
                  <Route
                      path="/"
                      element={<Navigate to={``} replace />}
                  />
          </Routes>
      </div>
    );
  }
  