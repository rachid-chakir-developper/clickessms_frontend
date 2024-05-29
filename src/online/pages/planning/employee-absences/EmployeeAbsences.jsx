import { Routes, Route, Navigate } from 'react-router-dom';
import ListEmployeeAbsences from './ListEmployeeAbsences';
import AddEmployeeAbsence from './AddEmployeeAbsence';
import EmployeeAbsenceDetails from './EmployeeAbsenceDetails';

export default function EmployeeAbsences() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListEmployeeAbsences />} />
        <Route path={`ajouter`} element={<AddEmployeeAbsence />} />
        <Route
          path={`modifier/:idEmployeeAbsence`}
          element={<AddEmployeeAbsence />}
        />
        <Route
          path={`details/:idEmployeeAbsence`}
          element={<EmployeeAbsenceDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
