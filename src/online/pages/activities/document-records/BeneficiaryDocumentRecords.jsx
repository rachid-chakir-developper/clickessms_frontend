import { Routes, Route, Navigate } from 'react-router-dom';
import ListBeneficiaryDocumentRecords from './ListBeneficiaryDocumentRecords';
import { Box } from '@mui/material';

export default function BeneficiaryDocumentRecords() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListBeneficiaryDocumentRecords />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
