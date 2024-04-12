
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListEstablishments from "./ListEstablishments";
  import AddEstablishment from "./AddEstablishment";
import EstablishmentDetails from "./EstablishmentDetails";
    
  export default function Establishments() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListEstablishments />} />
                  <Route path={`ajouter`} element={<AddEstablishment />} />
                  <Route path={`modifier/:idEstablishment`} element={<AddEstablishment />} />
                  <Route path={`details/:idEstablishment`} element={<EstablishmentDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  