import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Beneficiaries from "./beneficiaries/Beneficiaries";
  
export default function Humans() {

  return (
    <div className="human_ressources">
      <Routes>
            <Route path={`beneficiaires/*`} element={<Beneficiaries />} />
            <Route
                path="/"
                element={<Navigate to={`beneficiaires`} replace />}
            />
      </Routes>
    </div>
  );
}
