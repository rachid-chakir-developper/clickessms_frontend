import { Routes, Route, Navigate } from 'react-router-dom';
import ListActionPlanActions from './ListActionPlanActions';
import AddActionPlanAction from './AddActionPlanAction';
import ActionPlanActionDetails from './ActionPlanActionDetails';
import { Box } from '@mui/material';

export default function ActionPlanActions() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListActionPlanActions />} />
        <Route path={`ajouter`} element={<AddActionPlanAction />} />
        <Route
          path={`modifier/:idActionPlanAction`}
          element={<AddActionPlanAction />}
        />
        <Route
          path={`details/:idActionPlanAction`}
          element={<ActionPlanActionDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
