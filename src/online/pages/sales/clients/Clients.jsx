
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListClients from "./ListClients";
  import AddClient from "./AddClient";
import ClientDetails from "./ClientDetails";
    
  export default function Clients() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListClients />} />
                  <Route path={`ajouter`} element={<AddClient />} />
                  <Route path={`modifier/:idClient`} element={<AddClient />} />
                  <Route path={`details/:idClient`} element={<ClientDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  