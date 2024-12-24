import { Routes, Route, Navigate } from 'react-router-dom';
import ListBoxIdeas from './ListBoxIdeas';
import AddBoxIdea from './AddBoxIdea';
import { Box } from '@mui/material';
import BoxIdeaDetails from './BoxIdeaDetails';

export default function BoxIdeas() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListBoxIdeas />} />
        <Route path={`ajouter`} element={<AddBoxIdea />} />
        <Route path={`modifier/:idBoxIdea`} element={<AddBoxIdea />} />
        <Route path={`details/:idBoxIdea`} element={<BoxIdeaDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
