
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListCalls from "./ListCalls";
  import AddCall from "./AddCall";
import CallDetails from "./CallDetails";
    
  export default function Calls() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListCalls />} />
                  <Route path={`ajouter`} element={<AddCall />} />
                  <Route path={`modifier/:idCall`} element={<AddCall />} />
                  <Route path={`details/:idCall`} element={<CallDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  