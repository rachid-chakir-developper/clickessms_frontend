import { Routes, Route, Navigate } from 'react-router-dom';
import ListTaskActions from './ListTaskActions';
import AddTaskAction from './AddTaskAction';
import TaskActionDetails from './TaskActionDetails';
import { Box } from '@mui/material';

export default function TaskActions() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListTaskActions />} />
        <Route path={`ajouter`} element={<AddTaskAction />} />
        <Route
          path={`modifier/:idTaskAction`}
          element={<AddTaskAction />}
        />
        <Route
          path={`details/:idTaskAction`}
          element={<TaskActionDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
