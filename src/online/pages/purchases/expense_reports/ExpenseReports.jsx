import { Routes, Route, Navigate } from 'react-router-dom';
import ListExpenseReports from './ListExpenseReports';
import AddExpenseReport from './AddExpenseReport';
import ExpenseReportDetails from './ExpenseReportDetails';
import { Box } from '@mui/material';

export default function ExpenseReports() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListExpenseReports />} />
        <Route path={`ajouter`} element={<AddExpenseReport />} />
        <Route path={`modifier/:idExpenseReport`} element={<AddExpenseReport />} />
        <Route path={`details/:idExpenseReport`} element={<ExpenseReportDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
