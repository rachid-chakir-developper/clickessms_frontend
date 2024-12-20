import { Routes, Route, Navigate } from 'react-router-dom';

import { Box } from '@mui/material';
import SpaceRooms from './space_rooms/SpaceRooms';

export default function BuildingEstate() {
  return (
    <Box>
      <Routes>
        <Route
          path={`salles/*`}
          element={<SpaceRooms />}
        />
        <Route
          path="/"
          element={<Navigate to={`salles`} replace />}
        />
      </Routes>
    </Box>
  );
}
