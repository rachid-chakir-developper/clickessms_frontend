
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListUndesirableEvents from "./ListUndesirableEvents";
  import AddUndesirableEvent from "./AddUndesirableEvent";
import UndesirableEventDetails from "./UndesirableEventDetails";
    
  export default function UndesirableEvents() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListUndesirableEvents />} />
                  <Route path={`ajouter`} element={<AddUndesirableEvent />} />
                  <Route path={`modifier/:idUndesirableEvent`} element={<AddUndesirableEvent />} />
                  <Route path={`details/:idUndesirableEvent`} element={<UndesirableEventDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  