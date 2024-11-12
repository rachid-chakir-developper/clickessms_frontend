import { Routes, Route, Navigate } from 'react-router-dom';
import ListBudgets from './ListBudgets';
import AddBudget from './AddBudget';
import { Box } from '@mui/material';
import BudgetDetails from './BudgetDetails';

export default function Budgets() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListBudgets />} />
        <Route path={`ajouter`} element={<AddBudget />} />
        <Route path={`modifier/:idBudget`} element={<AddBudget />} />
        <Route path={`details/:idBudget`} element={<BudgetDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
