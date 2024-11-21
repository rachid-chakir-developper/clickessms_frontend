import { Routes, Route, Navigate } from 'react-router-dom';
import CompanySetting from './CompanySetting';
import { Box } from '@mui/material';
import CompanyMediaSetting from './CompanyMediaSetting';

export default function Tasks() {
  return (
    <Box>
      <Routes>
        <Route path={``} element={<CompanySetting />} />
        <Route path={`medias`} element={<CompanyMediaSetting />} />
        <Route path="/" element={<Navigate to={``} replace />} />
      </Routes>
    </Box>
  );
}
