import { Routes, Route, Navigate } from 'react-router-dom';
import ListLetters from './ListLetters';
import AddLetter from './AddLetter';
import LetterDetails from './LetterDetails';
import { Box } from '@mui/material';

export default function Letters() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListLetters />} />
        <Route path={`ajouter`} element={<AddLetter />} />
        <Route path={`modifier/:idLetter`} element={<AddLetter />} />
        <Route path={`details/:idLetter`} element={<LetterDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
