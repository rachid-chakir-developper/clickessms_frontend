import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AppBarHeader from './AppBarHeader';

import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import NavMenu from './navigation/NavMenu';
import Users from './pages/users/Users';
import Sales from './pages/sales/Sales';
import Purchases from './pages/purchases/Purchases';
import Works from './pages/works/Works';
import Maps from './pages/maps/Maps';
import Chat from './pages/chat/Chat';
import Loans from './pages/loan_management/Loans';
import Partnerships from './pages/partnerships/Partnerships';
import Settings from './pages/settings/Settings';
import Logo from '../_shared/components/app/Logo';
import AccountCard from './_shared/components/accounts/AccountCard';
import Account from './pages/account/Account';
import Humans from './pages/human_ressources/Humans';
import Activities from './pages/activities/Activities';
import Qualities from './pages/qualities/Qualities';
import Administratives from './pages/administratives/Administratives';
import Companies from './pages/companies/Companies';
import Finance from './pages/finance/Finance';
import Governance from './pages/governance/Governance';
import Planning from './pages/planning/Planning';
import Parking from './pages/parking/Parking';
import ChatbotButton from './_shared/components/robert_ia/ChatBotButton';
import SpeedDialTooltipOpen from '../_shared/components/app/SpeedDialTooltipOpen';
import { AuthorizationSystemProvider } from '../_shared/context/AuthorizationSystemProvider';
import Roberp from './pages/roberp/Roberp';
import Sce from './pages/sce/Sce';
import Computers from './pages/computers/Computers';
import BuildingEstate from './pages/building_estate/BuildingEstate';

const drawerWidth = 280;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    width: '6px',
    display: 'none',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: '0px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#555',
  },
  '&:hover': {
    '&::-webkit-scrollbar': {
      display: 'block',
    },
  },
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    width: '6px',
    display: 'none',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: '0px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#555',
  },
  '&:hover': {
    '&::-webkit-scrollbar': {
      display: 'block',
    },
  },
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function Online() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AuthorizationSystemProvider>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarHeader open={open} handleDrawerToggle={handleDrawerToggle} />
        <Drawer variant="permanent" open={open}>
          <DrawerHeader
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Logo />
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <AccountCard open={open} />
          <NavMenu />
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${open ? drawerWidth : 20}px)`,
            height: '100%',
            paddingBottom: 20,
          }}
        >
          <DrawerHeader />
          <Routes>
            <Route path={`dashboard/*`} element={<Dashboard />} />
            <Route path="/" element={<Navigate to={`dashboard`} replace />} />
            <Route path={`carte/*`} element={<Maps />} />
            <Route path={`associations/*`} element={<Companies />} />
            <Route path={`parc-automobile/*`} element={<Parking />} />
            <Route path={`informatique/*`} element={<Computers />} />
            <Route path={`travaux/*`} element={<Works />} />
            <Route path={`recuperations/*`} element={<Loans />} />
            <Route path={`partenariats/*`} element={<Partnerships />} />
            <Route path={`achats/*`} element={<Purchases />} />
            <Route path={`ventes/*`} element={<Sales />} />
            <Route path={`activites/*`} element={<Activities />} />
            <Route path={`qualites/*`} element={<Qualities />} />
            <Route path={`administratif/*`} element={<Administratives />} />
            <Route path={`finance/*`} element={<Finance />} />
            <Route path={`ressources-humaines/*`} element={<Humans />} />
            <Route path={`gouvernance/*`} element={<Governance />} />
            <Route path={`cse/*`} element={<Sce />} />
            <Route path={`utilisateurs/*`} element={<Users />} />
            <Route path={`parametres/*`} element={<Settings />} />
            <Route path={`chat/*`} element={<Chat />} />
            <Route path={`account/*`} element={<Account />} />
            <Route path={`planning/*`} element={<Planning />} />
            <Route path={`batiment-immobilier/*`} element={<BuildingEstate />} />
            <Route path={`roberp/*`} element={<Roberp />} />
          </Routes>
        </Box>
        <SpeedDialTooltipOpen />
        <ChatbotButton />
      </Box>
    </AuthorizationSystemProvider>
  );
}
