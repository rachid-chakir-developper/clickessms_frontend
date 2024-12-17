import { Routes, Route, Navigate } from 'react-router-dom';
import ListPersonalizedProjects from './ListPersonalizedProjects';
import AddPersonalizedProject from './AddPersonalizedProject';
import { Box } from '@mui/material';
import PersonalizedProjectDetails from './PersonalizedProjectDetails';

export default function PersonalizedProjects() {
  return (
    <Box>
      <Routes>
        <Route path={`liste`} element={<ListPersonalizedProjects />} />
        <Route path={`ajouter`} element={<AddPersonalizedProject />} />
        <Route path={`modifier/:idPersonalizedProject`} element={<AddPersonalizedProject />} />
        <Route path={`details/:idPersonalizedProject`} element={<PersonalizedProjectDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </Box>
  );
}
