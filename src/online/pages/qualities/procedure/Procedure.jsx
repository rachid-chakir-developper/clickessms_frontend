import { Routes, Route, Navigate } from 'react-router-dom';
import ListFrameDocuments from './ListProcedureDocuments';
import AddFrameDocument from './AddProcedureDocument';
import FrameDocumentDetails from './ProcedudeDocumentDetails';
import { Box } from '@mui/material';

export default function Procedure() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListFrameDocuments />} />
        <Route path={`ajouter`} element={<AddFrameDocument />} />
        <Route
          path={`modifier/:idFrameDocument`}
          element={<AddFrameDocument />}
        />
        <Route
          path={`details/:idFrameDocument`}
          element={<FrameDocumentDetails />}
        />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
