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
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';

import { NavLink, useNavigate } from 'react-router-dom';
import { Collapse } from '@mui/material';
import {
  Apartment,
  Business,
  Category,
  Email,
  Engineering,
  Event,
  EventBusy,
  EventNote,
  ExpandLess,
  ChevronRight,
  Groups,
  Groups2,
  Groups3,
  HomeRepairService,
  Tty,
  Workspaces,
  Note,
  School,
  InterpreterMode,
  Construction,
  Backup,
  Computer,
  Microsoft,
  Group,
  Savings,
  Work,
  PriceChange,
} from '@mui/icons-material';
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
    },
  },
}));

function MainListItems({ open }) {
  const [openedItems, setOpenedItems] = React.useState([
    'establishment',
    'activities',
    'qualities',
    'administratives',
    'human_ressources',
  ]);

  const handleClickToOpenItem = (openedItem) => {
    if (openedItems.includes(openedItem))
      setOpenedItems(openedItems.filter((item) => item !== openedItem));
    else setOpenedItems([...openedItems, openedItem]);
  };
  return (
    <>
      <StyledNavLink to="/online/dashboard">
        <ListItem key={'dashboard'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {' '}
              <DashboardIcon />{' '}
            </ListItemIcon>
            <ListItemText
              primary={'Dashboard'}
              sx={{ opacity: open ? 1 : 0 }}
            />
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
      <ListItem key={'establishment'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={() => handleClickToOpenItem('establishment')}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {' '}
            <Business />{' '}
          </ListItemIcon>
          <ListItemText
            primary={'Etablissements'}
            sx={{ opacity: open ? 1 : 0 }}
          />
          {openedItems.includes('establishment') ? (
            <ExpandLess />
          ) : (
            <ChevronRight />
          )}
        </ListItemButton>
        <Collapse
          in={openedItems.includes('establishment')}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <StyledNavLink to="/online/associations/etablissements">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Apartment />
                </ListItemIcon>
                <ListItemText primary="Etablissements" />
              </ListItemButton>
            </StyledNavLink>
            <StyledNavLink to="/online/associations/services">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <HomeRepairService />
                </ListItemIcon>
                <ListItemText primary="Services" />
              </ListItemButton>
            </StyledNavLink>
          </List>
        </Collapse>
      </ListItem>

      <ListItem key={'qualities'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={() => handleClickToOpenItem('qualities')}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {' '}
            <Groups />{' '}
          </ListItemIcon>
          <ListItemText primary={'Qualité'} sx={{ opacity: open ? 1 : 0 }} />
          {openedItems.includes('qualities') ? (
            <ExpandLess />
          ) : (
            <ChevronRight />
          )}
        </ListItemButton>
        <Collapse
          in={openedItems.includes('qualities')}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <StyledNavLink to="/online/qualites/evenements-indesirables">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <EventNote />
                </ListItemIcon>
                <ListItemText primary="Evénéments Indésirables" />
              </ListItemButton>
            </StyledNavLink>
            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <EventNote />
              </ListItemIcon>
              <ListItemText primary="RGPD" />
            </ListItemButton>
          </List>
        </Collapse>
      </ListItem>

      <ListItem key={'activities'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={() => handleClickToOpenItem('activities')}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {' '}
            <Groups />{' '}
          </ListItemIcon>
          <ListItemText primary={'Activité'} sx={{ opacity: open ? 1 : 0 }} />
          {openedItems.includes('activities') ? (
            <ExpandLess />
          ) : (
            <ChevronRight />
          )}
        </ListItemButton>
        <Collapse
          in={openedItems.includes('activities')}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <StyledNavLink to="/online/ressources-humaines/beneficiaires">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Groups2 />
                </ListItemIcon>
                <ListItemText primary="Beneficiaires" />
              </ListItemButton>
            </StyledNavLink>
            <StyledNavLink to="/online/activites/evenements">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Event />
                </ListItemIcon>
                <ListItemText primary="Evénéments" />
              </ListItemButton>
            </StyledNavLink>
            <StyledNavLink to="/online/activites/absences-beneficiaires">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <EventBusy />
                </ListItemIcon>
                <ListItemText primary="Absences" />
              </ListItemButton>
            </StyledNavLink>
          </List>
        </Collapse>
      </ListItem>

      <ListItem
        key={'human_ressources'}
        disablePadding
        sx={{ display: 'block' }}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={() => handleClickToOpenItem('human_ressources')}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {' '}
            <Groups />{' '}
          </ListItemIcon>
          <ListItemText
            primary={'Ressources humaines'}
            sx={{ opacity: open ? 1 : 0 }}
          />
          {openedItems.includes('human_ressources') ? (
            <ExpandLess />
          ) : (
            <ChevronRight />
          )}
        </ListItemButton>
        <Collapse
          in={openedItems.includes('human_ressources')}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <StyledNavLink to="/online/ressources-humaines/employes">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Engineering />
                </ListItemIcon>
                <ListItemText primary="Employés" />
              </ListItemButton>
            </StyledNavLink>

            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <School />
              </ListItemIcon>
              <ListItemText primary="Formations" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <InterpreterMode />
              </ListItemIcon>
              <ListItemText primary="Entretiens" />
            </ListItemButton>
          </List>
        </Collapse>
      </ListItem>
      <ListItem
        key={'administratives'}
        disablePadding
        sx={{ display: 'block' }}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={() => handleClickToOpenItem('administratives')}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {' '}
            <Groups />{' '}
          </ListItemIcon>
          <ListItemText
            primary={'Administratif'}
            sx={{ opacity: open ? 1 : 0 }}
          />
          {openedItems.includes('administratives') ? (
            <ExpandLess />
          ) : (
            <ChevronRight />
          )}
        </ListItemButton>
        <Collapse
          in={openedItems.includes('administratives')}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <StyledNavLink to="/online/administratif/appels">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Tty />
                </ListItemIcon>
                <ListItemText primary="Appels" />
              </ListItemButton>
            </StyledNavLink>
            <StyledNavLink to="/online/administratif/courriers">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText primary="Courriers" />
              </ListItemButton>
            </StyledNavLink>
            <StyledNavLink to="/online/administratif/reunions">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Workspaces />
                </ListItemIcon>
                <ListItemText primary="Réunions" />
              </ListItemButton>
            </StyledNavLink>

            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <Note />
              </ListItemIcon>
              <ListItemText primary="CR Réunion" />
            </ListItemButton>
            <StyledNavLink to="/online/partenariats/partenaires">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Groups3 />
                </ListItemIcon>
                <ListItemText primary="Partenaires" />
              </ListItemButton>
            </StyledNavLink>
            <StyledNavLink to="/online/achats/fournisseurs">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Fournisseurs" />
              </ListItemButton>
            </StyledNavLink>
            <StyledNavLink to="/online/recuperations/objets">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Category />
                </ListItemIcon>
                <ListItemText primary="Récupérations" />
              </ListItemButton>
            </StyledNavLink>
          </List>
        </Collapse>
      </ListItem>
    </>
  );
}

function SecondaryListItems({ open }) {
  const [openedItems, setOpenedItems] = React.useState(['human_ressources']);

  const handleClickToOpenItem = (openedItem) => {
    if (openedItems.includes(openedItem))
      setOpenedItems(openedItems.filter((item) => item !== openedItem));
    else setOpenedItems([...openedItems, openedItem]);
  };
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const dispatch = useSessionDispatch();
  const [logoutUser, { loading: loadingLogout }] = useMutation(LOGOUT_USER, {
    onCompleted: (datas) => {
      if (datas.logoutUser.done) {
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `${datas.logoutUser.message}.`,
          type: 'error',
        });
      }
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: "Une erreur s'est produite",
        type: 'error',
      });
    },
  });

  const onLogoutUser = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment vous déconnecter ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        logoutUser();
      },
    });
  };
  return (
    <>
      <StyledNavLink to="/online/utilisateurs">
        <ListItem key={'dashboard'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {' '}
              <PersonIcon />{' '}
            </ListItemIcon>
            <ListItemText
              primary={'Utilisateurs'}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
      </StyledNavLink>
      <StyledNavLink to="/online/parametres">
        <ListItem key={'settings'} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {' '}
              <SettingsIcon />{' '}
            </ListItemIcon>
            <ListItemText
              primary={'Paramètres'}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
      </StyledNavLink>
      <ListItem
        key={'logout'}
        disablePadding
        sx={{ display: 'block' }}
        onClick={onLogoutUser}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {' '}
            <PowerSettingsNewIcon />{' '}
          </ListItemIcon>
          <ListItemText
            primary={'Se déconnecter'}
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>
    </>
  );
}

function MoreItems({ open }) {
  const [openedItems, setOpenedItems] = React.useState([
    'partnerships',
    'sales',
    'purchases',
    'Gouvernance',
  ]);

  const handleClickToOpenItem = (openedItem) => {
    if (openedItems.includes(openedItem))
      setOpenedItems(openedItems.filter((item) => item !== openedItem));
    else setOpenedItems([...openedItems, openedItem]);
  };
  return (
    <>
      <ListItem key={'partnerships'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={() => handleClickToOpenItem('partnerships')}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {' '}
            <Construction />{' '}
          </ListItemIcon>
          <ListItemText
            primary={'Service généraux'}
            sx={{ opacity: open ? 1 : 0 }}
          />
          {openedItems.includes('partnerships') ? (
            <ExpandLess />
          ) : (
            <ChevronRight />
          )}
        </ListItemButton>
        <Collapse
          in={openedItems.includes('partnerships')}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <StyledNavLink to="/online/travaux/interventions">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <EventAvailableIcon />
                </ListItemIcon>
                <ListItemText primary="Interventions" />
              </ListItemButton>
            </StyledNavLink>
            <StyledNavLink to="/online/vehicules">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Parc automobile" />
              </ListItemButton>
            </StyledNavLink>

            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <School />
              </ListItemIcon>
              <ListItemText primary="Compteurs" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <InterpreterMode />
              </ListItemIcon>
              <ListItemText primary="Engagements" />
            </ListItemButton>
          </List>
        </Collapse>
      </ListItem>
      <ListItem key={'sales'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={() => handleClickToOpenItem('sales')}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {' '}
            <Work />{' '}
          </ListItemIcon>
          <ListItemText primary={'Finance'} sx={{ opacity: open ? 1 : 0 }} />
          {openedItems.includes('sales') ? <ExpandLess /> : <ChevronRight />}
        </ListItemButton>
        <Collapse
          in={openedItems.includes('sales')}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <PriceChange />
              </ListItemIcon>
              <ListItemText primary="Dépenses" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <HomeRepairService />
              </ListItemIcon>
              <ListItemText primary="Caisse" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <Savings />
              </ListItemIcon>
              <ListItemText primary="Budget" />
            </ListItemButton>
          </List>
        </Collapse>
      </ListItem>
      <ListItem key={'purchases'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={() => handleClickToOpenItem('purchases')}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {' '}
            <ShoppingCartIcon />{' '}
          </ListItemIcon>
          <ListItemText
            primary={'Informatique'}
            sx={{ opacity: open ? 1 : 0 }}
          />
          {openedItems.includes('purchases') ? (
            <ExpandLess />
          ) : (
            <ChevronRight />
          )}
        </ListItemButton>
        <Collapse
          in={openedItems.includes('purchases')}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <StyledNavLink to="/online/materiels">
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Computer />
                </ListItemIcon>
                <ListItemText primary="Matériels" />
              </ListItemButton>
            </StyledNavLink>
            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <Microsoft />
              </ListItemIcon>
              <ListItemText primary="Logiciel" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <Backup />
              </ListItemIcon>
              <ListItemText primary="Sauvegardes" />
            </ListItemButton>
          </List>
        </Collapse>
      </ListItem>

      <ListItem key={'Gouvernance'} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={() => handleClickToOpenItem('Gouvernance')}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {' '}
            <Groups2 />{' '}
          </ListItemIcon>
          <ListItemText
            primary={'Gouvernance'}
            sx={{ opacity: open ? 1 : 0 }}
          />
          {openedItems.includes('Gouvernance') ? (
            <ExpandLess />
          ) : (
            <ChevronRight />
          )}
        </ListItemButton>
        <Collapse
          in={openedItems.includes('Gouvernance')}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary="Membres" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} disabled>
              <ListItemIcon>
                <Note />
              </ListItemIcon>
              <ListItemText primary="CR Réunion" />
            </ListItemButton>
          </List>
        </Collapse>
      </ListItem>
      {/* <StyledNavLink to="/online/travaux/interventions">
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
        {openedItems.includes('partnerships') ? <ExpandLess /> : <ChevronRight />}
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
        {openedItems.includes('purchases') ? <ExpandLess /> : <ChevronRight />}
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
        {openedItems.includes('sales') ? <ExpandLess /> : <ChevronRight />}
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
    </ListItem> */}
    </>
  );
}

export default function ListItems({ open }) {
  return (
    <>
      <List>
        <MainListItems open={open} />
      </List>
      <MoreItems open={open} />
      <Divider />
      <List>
        <SecondaryListItems open={open} />
      </List>
    </>
  );
}
