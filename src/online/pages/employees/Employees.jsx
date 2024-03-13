
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListEmployees from "./ListEmployees";
  import AddEmployee from "./AddEmployee";
import EmployeeDetails from "./EmployeeDetails";
    
  export default function Employees() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListEmployees />} />
                  <Route path={`ajouter`} element={<AddEmployee />} />
                  <Route path={`modifier/:idEmployee`} element={<AddEmployee />} />
                  <Route path={`details/:idEmployee`} element={<EmployeeDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  