import { Routes, Route, Navigate } from 'react-router-dom';
import ListSpaceRooms from './ListSpaceRooms';
import AddSpaceRoom from './AddSpaceRoom';
import { Box } from '@mui/material';
import SpaceRoomDetails from './SpaceRoomDetails';

export default function SpaceRooms() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListSpaceRooms />} />
        <Route path={`ajouter`} element={<AddSpaceRoom />} />
        <Route path={`modifier/:idSpaceRoom`} element={<AddSpaceRoom />} />
        <Route path={`details/:idSpaceRoom`} element={<SpaceRoomDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
