
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
import Profile from "./Profile";
    
  export default function Account() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`profil`} element={<Profile />} />
                  <Route
                      path="/"
                      element={<Navigate to={`profil`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  