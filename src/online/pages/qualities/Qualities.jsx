


import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import UndesirableEvents from "./undesirable-events/UndesirableEvents";
import { Box } from "@mui/material";
  
export default function Qualities() {

  return (
    <Box>
      <Routes>
            <Route path={`evenements-indesirables/*`} element={<UndesirableEvents />} />
            <Route
                path="/"
                element={<Navigate to={`evenements-indesirables`} replace />}
            />
      </Routes>
    </Box>
  );
}
