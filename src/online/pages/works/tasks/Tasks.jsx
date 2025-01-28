import { Routes, Route, Navigate } from 'react-router-dom';
import ListTasks from './ListTasks';
import AddTask from './AddTask';
import TaskDetails from './TaskDetails';
import { Box } from '@mui/material';

export default function Tasks() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListTasks />} />
        <Route path={`ajouter`} element={<AddTask />} />
        <Route path={`modifier/:idTask`} element={<AddTask />} />
        <Route path={`details/:idTask`} element={<TaskDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
