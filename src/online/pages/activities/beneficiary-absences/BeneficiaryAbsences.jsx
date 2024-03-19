
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListBeneficiaryAbsences from "./ListBeneficiaryAbsences";
  import AddBeneficiaryAbsence from "./AddBeneficiaryAbsence";
import BeneficiaryAbsenceDetails from "./BeneficiaryAbsenceDetails";
    
  export default function BeneficiaryAbsences() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListBeneficiaryAbsences />} />
                  <Route path={`ajouter`} element={<AddBeneficiaryAbsence />} />
                  <Route path={`modifier/:idBeneficiaryAbsence`} element={<AddBeneficiaryAbsence />} />
                  <Route path={`details/:idBeneficiaryAbsence`} element={<BeneficiaryAbsenceDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  