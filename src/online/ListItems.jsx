
import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ConstructionIcon from '@mui/icons-material/Construction';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import { CalendarIcon } from '@mui/x-date-pickers';

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Collapse } from '@mui/material';
import { Apartment, Block, CalendarMonth, Category, Diversity3, Engineering, ExpandLess, ExpandMore, Groups, Groups2, Groups3, Handshake, Map } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useFeedBacks } from '../_shared/context/feedbacks/FeedBacksProvider';
import { LOGOUT_USER } from '../_shared/graphql/mutations/AuthMutations';
import { useMutation } from '@apollo/client';
import { useSessionDispatch } from '../_shared/context/SessionProvider';

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  display: 'block',
  textDecoration: 'none',
  color: 'inherit',
  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '.MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    }
  },
}));

function  MainListItems({open}) {
  const [openedItems, setOpenedItems] = React.useState(['partnerships', 'sales', 'purchases']);

  const handleClickToOpenItem = (openedItem) => {
    if(openedItems.includes(openedItem)) setOpenedItems(openedItems.filter(item => item !== openedItem));
    else setOpenedItems([...openedItems, openedItem]);
  };
  return (
    <>
      <StyledNavLink to="/online/dashboard">
        <ListItem key={'dashboard'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <DashboardIcon /> </ListItemIcon>
            <ListItemText primary={'Dashboard'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </StyledNavLink>
      {/* <StyledNavLink to="/online/calendrier">
        <ListItem key={'calendar'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <CalendarIcon /> </ListItemIcon>
            <ListItemText primary={'Calendrier'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </StyledNavLink> */}
      {/* <StyledNavLink to="/online/carte">
        <ListItem key={'carte'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <Map /> </ListItemIcon>
            <ListItemText primary={'La carte'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </StyledNavLink> */}
      <StyledNavLink to="/online/etablissements">
        <ListItem key={'vehicles'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <Apartment /> </ListItemIcon>
            <ListItemText primary={'Etablissements'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </StyledNavLink>
      <StyledNavLink to="/online/travaux/interventions">
        <ListItem key={'tasks'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <EventAvailableIcon /> </ListItemIcon>
            <ListItemText primary={'Interventions'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </StyledNavLink>
      <StyledNavLink to="/online/recuperations/objets">
        <ListItem key={'tasks'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <Category /> </ListItemIcon>
            <ListItemText primary={'Récupérations'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </StyledNavLink>
      <StyledNavLink to="/online/materiels">
        <ListItem key={'materials'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <ConstructionIcon /> </ListItemIcon>
            <ListItemText primary={'Matériels'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </StyledNavLink>
      <StyledNavLink to="/online/vehicules">
        <ListItem key={'vehicles'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <LocalShippingIcon /> </ListItemIcon>
            <ListItemText primary={'Véhicules'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </StyledNavLink>
      <ListItem key={'partnerships'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }}  onClick={() => handleClickToOpenItem('partnerships')}>
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <Handshake /> </ListItemIcon>
          <ListItemText primary={'partenariats'} sx={{ opacity: open ? 1 : 0 }} />
          {openedItems.includes('partnerships') ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openedItems.includes('partnerships')} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <StyledNavLink to="/online/partenariats/partenaires">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Groups3 />
                </ListItemIcon>
                <ListItemText primary="Partenaires" />
              </ListItemButton>
            </StyledNavLink>
          </List>
        </Collapse>
      </ListItem>
      <ListItem key={'purchases'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }}  onClick={() => handleClickToOpenItem('purchases')}>
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <ShoppingCartIcon /> </ListItemIcon>
          <ListItemText primary={'Achats'} sx={{ opacity: open ? 1 : 0 }} />
          {openedItems.includes('purchases') ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openedItems.includes('purchases')} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <StyledNavLink to="/online/achats/fournisseurs">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Fournisseurs" />
              </ListItemButton>
            </StyledNavLink>
          </List>
        </Collapse>
      </ListItem>
      <ListItem key={'sales'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }}  onClick={() => handleClickToOpenItem('sales')}>
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <StorefrontIcon /> </ListItemIcon>
          <ListItemText primary={'Ventes'} sx={{ opacity: open ? 1 : 0 }} />
          {openedItems.includes('sales') ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openedItems.includes('sales')} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <StyledNavLink to="/online/ventes/clients">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Diversity3 />
                </ListItemIcon>
                <ListItemText primary="Clients" />
              </ListItemButton>
            </StyledNavLink>
          </List>
        </Collapse>
      </ListItem>
    </>
  );
}

function  SecondaryListItems({open}){
  
  const [openedItems, setOpenedItems] = React.useState(['human_ressources']);

  const handleClickToOpenItem = (openedItem) => {
    if(openedItems.includes(openedItem)) setOpenedItems(openedItems.filter(item => item !== openedItem));
    else setOpenedItems([...openedItems, openedItem]);
  };
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const navigate = useNavigate();
    const dispatch = useSessionDispatch();
    const [logoutUser, { loading : loadingLogout }] = useMutation(LOGOUT_USER, {
      onCompleted: (datas) => {
        if(datas.logoutUser.done){
        }else{
            setNotifyAlert({
            isOpen: true,
            message: `${datas.logoutUser.message}.`,
            type: 'error'
            })
        }
        dispatch({ type: 'LOGOUT' })
        navigate('/');
      },
      onError: (err) => {
        console.log(err)
        setNotifyAlert({
            isOpen: true,
            message: "Une erreur s'est produite",
            type: 'error'
        })
      },
  })
  
  const onLogoutUser = () => {
      setConfirmDialog({
        isOpen: true,
        title: 'ATTENTION',
        subTitle: "Voulez vous vraiment vous déconnecter ?",
        onConfirm: () => { setConfirmDialog({isOpen: false})
                          logoutUser()
                      }
      })
  }
  return (
    <>
      <ListItem key={'human_ressources'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }}  onClick={() => handleClickToOpenItem('human_ressources')}>
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <Groups /> </ListItemIcon>
          <ListItemText primary={'Ressources humaines'} sx={{ opacity: open ? 1 : 0 }} />
          {openedItems.includes('human_ressources') ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openedItems.includes('human_ressources')} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <StyledNavLink to="/online/ressources-humaines/beneficiaires">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Groups2 />
                </ListItemIcon>
                <ListItemText primary="Beneficiaires" />
              </ListItemButton>
            </StyledNavLink>
            <StyledNavLink to="/online/ressources-humaines/employes">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Engineering />
                </ListItemIcon>
                <ListItemText primary="Employés" />
              </ListItemButton>
            </StyledNavLink>
          </List>
        </Collapse>
      </ListItem>
      <StyledNavLink to="/online/utilisateurs">
        <ListItem key={'dashboard'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <PersonIcon /> </ListItemIcon>
            <ListItemText primary={'Utilisateurs'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </StyledNavLink>
      <StyledNavLink to="/online/parametres">
        <ListItem key={'settings'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <SettingsIcon /> </ListItemIcon>
            <ListItemText primary={'Paramètres'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </StyledNavLink>
      <ListItem key={'logout'} disablePadding sx={{ display: 'block' }} onClick={onLogoutUser}>
        <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <PowerSettingsNewIcon /> </ListItemIcon>
          <ListItemText primary={'Se déconnecter'} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
    </>
  );
}

function  MoreItems({open}){
  
  const [openedItems, setOpenedItems] = React.useState(['activities', 'qualities', 'administratives']);

  const handleClickToOpenItem = (openedItem) => {
    if(openedItems.includes(openedItem)) setOpenedItems(openedItems.filter(item => item !== openedItem));
    else setOpenedItems([...openedItems, openedItem]);
  };
  return (
    <>
      <ListItem key={'activities'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }}  onClick={() => handleClickToOpenItem('activities')}>
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <Groups /> </ListItemIcon>
          <ListItemText primary={'Activités'} sx={{ opacity: open ? 1 : 0 }} />
          {openedItems.includes('activities') ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openedItems.includes('activities')} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <StyledNavLink to="/online/activites/evenements">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CalendarMonth />
                </ListItemIcon>
                <ListItemText primary="Evénéments" />
              </ListItemButton>
            </StyledNavLink>
            <StyledNavLink to="/online/activites/absences-beneficiaires">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CalendarMonth />
                </ListItemIcon>
                <ListItemText primary="Absences" />
              </ListItemButton>
            </StyledNavLink>
          </List>
        </Collapse>
      </ListItem>
      <ListItem key={'qualities'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }}  onClick={() => handleClickToOpenItem('qualities')}>
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <Groups /> </ListItemIcon>
          <ListItemText primary={'Qualités'} sx={{ opacity: open ? 1 : 0 }} />
          {openedItems.includes('qualities') ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openedItems.includes('qualities')} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <StyledNavLink to="/online/qualites/evenements-indesirables">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CalendarMonth />
                </ListItemIcon>
                <ListItemText primary="Evénéments Indésirables" />
              </ListItemButton>
            </StyledNavLink>
          </List>
        </Collapse>
      </ListItem>
      <ListItem key={'administratives'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }}  onClick={() => handleClickToOpenItem('administratives')}>
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} > <Groups /> </ListItemIcon>
          <ListItemText primary={'Administratif'} sx={{ opacity: open ? 1 : 0 }} />
          {openedItems.includes('administratives') ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openedItems.includes('administratives')} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <StyledNavLink to="/online/administratif/appels">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CalendarMonth />
                </ListItemIcon>
                <ListItemText primary="Appels" />
              </ListItemButton>
            </StyledNavLink>
          </List>
        </Collapse>
      </ListItem>
    </>
  );
}

export default function  ListItems({open}) {
  return (
    <>
      <List>
        <MainListItems open={open} />
      </List>
      <Divider />
        <MoreItems open={open} />
      <Divider />
      <List>
          <SecondaryListItems open={open}/>
      </List>
    </>
  )
}