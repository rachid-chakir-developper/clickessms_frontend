import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Beneficiaries from "./beneficiaries/Beneficiaries";
import Employees from "./employees/Employees";
  
export default function Humans() {

  return (
    <div className="human_ressources">
      <Routes>
            <Route path={`beneficiaires/*`} element={<Beneficiaries />} />
            <Route path={`employes/*`} element={<Employees />} />
            <Route
                path="/"
                element={<Navigate to={`employes`} replace />}
            />
      </Routes>
    </div>
  );
}
