import { Routes, Route, Navigate } from 'react-router-dom';
import ListPurchaseContracts from './ListPurchaseContracts';
import AddPurchaseContract from './AddPurchaseContract';
import { Box } from '@mui/material';
import PurchaseContractDetails from './PurchaseContractDetails';

export default function PurchaseContracts() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListPurchaseContracts />} />
        <Route path={`ajouter`} element={<AddPurchaseContract />} />
        <Route path={`modifier/:idPurchaseContract`} element={<AddPurchaseContract />} />
        <Route path={`details/:idPurchaseContract`} element={<PurchaseContractDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
