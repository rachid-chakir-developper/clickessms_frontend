import { Routes, Route, Navigate } from 'react-router-dom';
import CompanySetting from './CompanySetting';
import { Box } from '@mui/material';
import CompanyMediaSetting from './CompanyMediaSetting';
import CompanyModuleSetting from './CompanyModuleSetting';

export default function Tasks() {
  return (
    <Box>
      <Routes>
        <Route path={``} element={<CompanySetting />} />
        <Route path={`medias`} element={<CompanyMediaSetting />} />
        <Route path={`modules`} element={<CompanyModuleSetting />} />
        <Route path="/" element={<Navigate to={``} replace />} />
      </Routes>
    </Box>
  );
}
