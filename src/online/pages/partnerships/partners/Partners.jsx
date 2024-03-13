
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListPartners from "./ListPartners";
  import AddPartner from "./AddPartner";
import PartnerDetails from "./PartnerDetails";
    
  export default function Partners() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListPartners />} />
                  <Route path={`ajouter`} element={<AddPartner />} />
                  <Route path={`modifier/:idPartner`} element={<AddPartner />} />
                  <Route path={`details/:idPartner`} element={<PartnerDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  