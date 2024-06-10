import { Routes, Route, Navigate } from 'react-router-dom';
import ListActionPlanObjectives from './ListActionPlanObjectives';
import AddActionPlanObjective from './AddActionPlanObjective';
import ActionPlanObjectiveDetails from './ActionPlanObjectiveDetails';

export default function ActionPlanObjectives() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListActionPlanObjectives />} />
        <Route path={`ajouter`} element={<AddActionPlanObjective />} />
        <Route path={`modifier/:idActionPlanObjective`} element={<AddActionPlanObjective />} />
        <Route path={`details/:idActionPlanObjective`} element={<ActionPlanObjectiveDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
