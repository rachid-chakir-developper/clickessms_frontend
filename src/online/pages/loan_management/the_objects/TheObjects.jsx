
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListTheObjects from "./ListTheObjects";
  import AddTheObject from "./AddTheObject";
import TheObjectDetails from "./TheObjectDetails";
    
  export default function TheObjects() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListTheObjects />} />
                  <Route path={`ajouter`} element={<AddTheObject />} />
                  <Route path={`modifier/:idTheObject`} element={<AddTheObject />} />
                  <Route path={`details/:idTheObject`} element={<TheObjectDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  