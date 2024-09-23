import { Routes, Route, Navigate } from 'react-router-dom';
import ListPosts from './ListPosts';
import AddPost from './AddPost';
import { Box } from '@mui/material';
import PostDetails from './PostDetails';

export default function Posts() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListPosts />} />
        <Route path={`ajouter`} element={<AddPost />} />
        <Route path={`modifier/:idPost`} element={<AddPost />} />
        <Route path={`details/:idPost`} element={<PostDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
