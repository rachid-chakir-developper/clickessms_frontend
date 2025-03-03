import { Routes, Route, Navigate } from 'react-router-dom';
import ListUsers from './ListUsers';
import AddUser from './AddUser';
import { Box } from '@mui/material';

export default function Users() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListUsers />} />
        <Route path={`ajouter`} element={<AddUser />} />
        <Route path={`modifier/:idUser`} element={<AddUser />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
