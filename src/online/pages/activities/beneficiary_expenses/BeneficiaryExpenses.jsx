import { Routes, Route, Navigate } from 'react-router-dom';
import ListBeneficiaryExpenses from './ListBeneficiaryExpenses';
import AddBeneficiaryExpense from './AddBeneficiaryExpense';
import { Box } from '@mui/material';
import BeneficiaryExpenseDetails from './BeneficiaryExpenseDetails';

export default function BeneficiaryExpenses() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListBeneficiaryExpenses />} />
        <Route path={`ajouter`} element={<AddBeneficiaryExpense />} />
        <Route path={`modifier/:idBeneficiaryExpense`} element={<AddBeneficiaryExpense />} />
        <Route path={`details/:idBeneficiaryExpense`} element={<BeneficiaryExpenseDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
