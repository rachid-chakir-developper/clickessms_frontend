import { Routes, Route, Navigate } from 'react-router-dom';
import ListExpenses from './ListExpenses';
import AddExpense from './AddExpense';
import ExpenseDetails from './ExpenseDetails';
import { Box } from '@mui/material';

export default function Expenses() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListExpenses />} />
        <Route path={`ajouter`} element={<AddExpense />} />
        <Route path={`modifier/:idExpense`} element={<AddExpense />} />
        <Route path={`details/:idExpense`} element={<ExpenseDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
