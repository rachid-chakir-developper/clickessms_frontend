
import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DescriptionIcon from '@mui/icons-material/Description';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import PostAddIcon from '@mui/icons-material/PostAdd';
import KeyIcon from '@mui/icons-material/Key';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SavingsIcon from '@mui/icons-material/Savings';
import AddchartIcon from '@mui/icons-material/Addchart';
import SdCardAlertIcon from '@mui/icons-material/SdCardAlert';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CalculateIcon from '@mui/icons-material/Calculate';
import EmailIcon from '@mui/icons-material/Email';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SaveIcon from '@mui/icons-material/Save';
import PasswordIcon from '@mui/icons-material/Password';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import SourceIcon from '@mui/icons-material/Source';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import GavelIcon from '@mui/icons-material/Gavel';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import HandshakeIcon from '@mui/icons-material/Handshake';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DevicesIcon from '@mui/icons-material/Devices';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TaskIcon from '@mui/icons-material/Task';
import AccessibleIcon from '@mui/icons-material/Accessible';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MapIcon from '@mui/icons-material/Map';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import GppGoodIcon from '@mui/icons-material/GppGood';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import CommentIcon from '@mui/icons-material/Comment';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ContactsIcon from '@mui/icons-material/Contacts';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import TableBarIcon from '@mui/icons-material/TableBar';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import WalletIcon from '@mui/icons-material/Wallet';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Collapse } from '@mui/material';
import {
  Apartment,
  ExpandLess,
  ChevronRight,
  Groups,
  Note,
  School,
  InterpreterMode,
  Construction,
  Computer,
  Microsoft,
  Group,
  Money,
  AccountBalance,
  CarRepair,
  CarCrash,
  DirectionsCarFilled,
  Garage,
} from '@mui/icons-material';
import styled from '@emotion/styled';
import { useFeedBacks } from '../_shared/context/feedbacks/FeedBacksProvider';
import { LOGOUT_USER } from '../_shared/graphql/mutations/AuthMutations';
import { useMutation } from '@apollo/client';
import { useSessionDispatch } from '../_shared/context/SessionProvider';
import SearchBar from "./AppBarCategory";
import { categories } from "./AppBarCategory";

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
  const [openedItems, setOpenedItems] = React.useState([]);
  const [openedCategory, setOpenedCategory] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openedItemsSearch, setOpenedItemsSearch] = React.useState([]);

  const handleClickToOpenItem = (openedItem) => {
    const isAlreadyOpened = openedItems.includes(openedItem);

    if (isAlreadyOpened) {
      setOpenedItems([]);
    } else {
      setOpenedItems([openedItem]);
    }
  };

  const handleClickToOpenCategory = (category) => {
    const isAlreadyOpened = openedCategory === category;

    if (isAlreadyOpened) {
      setOpenedCategory('');
    } else {
      setOpenedCategory(category);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredCategories = categories.filter(category => {
    const filteredItems = category.items.filter(item =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return category.name || filteredItems.length > 0;
  });

  return (
      <>
        <div>
          <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
          {searchTerm && filteredCategories.map((category) => (
              <ListItem key={category.name} disablePadding sx={{ display: 'block' }}>
                <ListItemText primary={category.name} sx={{ opacity: openedItemsSearch.includes(category.name) ? 1 : 0 }} />
                <List component="div" disablePadding>
                  {category.items
                      .filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item) => (
                          <StyledNavLink key={item.to} to={item.to}>
                            <ListItemButton sx={{ pl: 4 }}>
                              <ListItemIcon>
                                {item.icon}
                              </ListItemIcon>
                              <ListItemText primary={item.text} />
                            </ListItemButton>
                          </StyledNavLink>
                      ))}
                </List>
              </ListItem>
          ))}
        </div>
        {!searchTerm && (
        <StyledNavLink to="/online/dashboard">
          <ListItem key={'dashboard'} disablePadding sx={{display: 'block'}}>
            <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
              <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <DashboardIcon/>
              </ListItemIcon>
              <ListItemText primary={'Dashboard'} sx={{opacity: open ? 1 : 0}}/>
            </ListItemButton>
          </ListItem>
        </StyledNavLink>
        )}
        {!searchTerm && (
        <ListItem key={'qualities'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('qualities')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <WorkspacePremiumIcon/>
            </ListItemIcon>
            <ListItemText primary={'Qualité'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('qualities') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('qualities')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem key={'évènements'} disablePadding sx={{display: 'block'}}>
                <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                                onClick={() => handleClickToOpenCategory('évènements')}>
                  <ListItemIcon sx={{paddingLeft: 1.5, minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}>
                    <NotificationsActiveIcon/> </ListItemIcon>
                  <ListItemText primary={'Évènements'} sx={{paddingLeft: 1, opacity: open ? 1 : 0}}/>
                  {openedCategory.includes('évènements') ? <ExpandLess/> : <ChevronRight/>}
                </ListItemButton>
                <Collapse in={openedCategory.includes('évènements')} sx={{backgroundColor: '#EFEFEF'}} timeout="auto"
                          unmountOnExit>
                  <List component="div" disablePadding>
                    <StyledNavLink to="/online/qualites/evenements-indesirables">
                      <ListItemButton sx={{pl: 4}}>
                        <ListItemIcon>
                          <WarningIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Évènements indésirables"/>
                      </ListItemButton>
                    </StyledNavLink>
                    <StyledNavLink to="/online/qualities/évènements/maltraitance-violence">
                      <ListItemButton sx={{pl: 4}}>
                        <ListItemIcon>
                          <DoNotDisturbOnIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Maltraitance et violence"/>
                      </ListItemButton>
                    </StyledNavLink>
                    <StyledNavLink to="/online/qualities/évènements/plaintes-réclamation">
                      <ListItemButton sx={{pl: 4}}>
                        <ListItemIcon>
                          <SentimentVeryDissatisfiedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Plaintes et réclamation"/>
                      </ListItemButton>
                    </StyledNavLink>
                  </List>
                </Collapse>
              </ListItem>
              <StyledNavLink to="/online/qualities/plan-d’action">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <MapIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Plan d’action"/>
                </ListItemButton>
              </StyledNavLink>
              <ListItem key={'audits'} disablePadding sx={{display: 'block'}}>
                <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                                onClick={() => handleClickToOpenCategory('audits')}>
                  <ListItemIcon sx={{paddingLeft: 1.5, minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}>
                    <NoteAltIcon/> </ListItemIcon>
                  <ListItemText primary={'Audits'} sx={{paddingLeft: 1, opacity: open ? 1 : 0}}/>
                  {openedCategory.includes('audits') ? <ExpandLess/> : <ChevronRight/>}
                </ListItemButton>
                <Collapse in={openedCategory.includes('audits')} sx={{backgroundColor: '#EFEFEF',}} timeout="auto"
                          unmountOnExit>
                  <List component="div" disablePadding>
                    <StyledNavLink to="/online/qualities/audits/evaluation-has">
                      <ListItemButton sx={{pl: 4}}>
                        <ListItemIcon>
                          <ChecklistRtlIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Évaluation HAS"/>
                      </ListItemButton>
                    </StyledNavLink>
                    <StyledNavLink to="/online/qualities/audits/rgpd">
                      <ListItemButton sx={{pl: 4}}>
                        <ListItemIcon>
                          <GppGoodIcon/>
                        </ListItemIcon>
                        <ListItemText primary="RGPD"/>
                      </ListItemButton>
                    </StyledNavLink>
                    <StyledNavLink to="/online/qualities/audits/Autodiagnostic-cpom">
                      <ListItemButton sx={{pl: 4}}>
                        <ListItemIcon>
                          <AddchartIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Autodiagnostic CPOM"/>
                      </ListItemButton>
                    </StyledNavLink>
                  </List>
                </Collapse>
              </ListItem>
              <StyledNavLink to="/online/audits/gestion-risques">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <SdCardAlertIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Gestion des risques"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/audits/enquêtes-résultats">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <QuestionAnswerIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Enquêtes et Résultats"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/audits/procédures">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <LibraryAddCheckIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Procédures"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/audits/qvct">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <Diversity1Icon/>
                  </ListItemIcon>
                  <ListItemText primary="QVCT"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/audits/boîte-idées">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <BatchPredictionIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Boîte à idées"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'activities'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('activities')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <TroubleshootIcon/>
            </ListItemIcon>
            <ListItemText primary={'Activité'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('activities') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('activities')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/*<StyledNavLink to="/online/ressources-humaines/beneficiaires">*/}
              {/*  <ListItemButton sx={{ pl: 4 }}>*/}
              {/*    <ListItemIcon>*/}
              {/*      <Groups2 />*/}
              {/*    </ListItemIcon>*/}
              {/*    <ListItemText primary="Beneficiaires" />*/}
              {/*  </ListItemButton>*/}
              {/*</StyledNavLink>*/}
              {/*<StyledNavLink to="/online/activites/evenements">*/}
              {/*  <ListItemButton sx={{ pl: 4 }}>*/}
              {/*    <ListItemIcon>*/}
              {/*      <Event />*/}
              {/*    </ListItemIcon>*/}
              {/*    <ListItemText primary="Evénéments" />*/}
              {/*  </ListItemButton>*/}
              {/*</StyledNavLink>*/}
              {/*<StyledNavLink to="/online/activites/absences-beneficiaires">*/}
              {/*  <ListItemButton sx={{ pl: 4 }}>*/}
              {/*    <ListItemIcon>*/}
              {/*      <EventBusy />*/}
              {/*    </ListItemIcon>*/}
              {/*    <ListItemText primary="Absences" />*/}
              {/*  </ListItemButton>*/}
              {/*</StyledNavLink>*/}
              
              <StyledNavLink to="/online/activites/dashboard">
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tableau de bord" />
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/activité/projet-personnalisé">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <RecentActorsIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Projets personnalisés ( PPA)"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/activites/evenements">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <CommentIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Évènements / Transmissions"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/activité/malette-loi-2002-2">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <LocalPoliceIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Malette loi 2002-2"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/activites/absences-beneficiaires">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <CalendarMonthIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Présences / Absences"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/activité/prestations">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <TaskIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Prestations"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/activité/Serafin-ph">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <AccessibleIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Serafin PH"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'human_ressources'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('human_ressources')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <Groups/>
            </ListItemIcon>
            <ListItemText primary={'Ressources humaines'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('human_ressources') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('human_ressources')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledNavLink to="/online/ressources-humaines/formations">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <CoPresentIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Formations"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/ressources-humaines/cr-entretiens">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <AssignmentIcon/>
                  </ListItemIcon>
                  <ListItemText primary="CR Entretiens"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/planning/absences-employes/">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <PersonRemoveIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Absences"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/notes-frais">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <RequestQuoteIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Notes de frais"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/ressources-humaines/planning">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <DateRangeIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Planning"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/ressources-humaines/bdes">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <LockPersonIcon/>
                  </ListItemIcon>
                  <ListItemText primary="BDES"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/ressources-humaines/vivier-candidats">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <ContactsIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Vivier candidats"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/ressources-humaines/convention-collective">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <AutoStoriesIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Convention collective"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/ressources-humaines/accord-d’entreprise">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <StickyNote2Icon/>
                  </ListItemIcon>
                  <ListItemText primary="Accord d’entreprise"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'administratives'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('administratives')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <EditNoteIcon/>
            </ListItemIcon>
            <ListItemText primary={'Administratif'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('administratives') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('administratives')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledNavLink to="/online/associations/structures">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <Apartment/>
                  </ListItemIcon>
                  <ListItemText primary="Structures"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/ressources-humaines/beneficiaires">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <AssignmentIndIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Bénéficiaires"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/ressources-humaines/employes">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <WalletIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Salariés"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/partenariats/financeurs">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <Diversity3Icon/>
                  </ListItemIcon>
                  <ListItemText primary="Financeur"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/partenariats/partenaires">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <HandshakeIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Partenaires"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/achats/fournisseurs">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <WarehouseIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Fournisseurs"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/administratif/appels">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <SupportAgentIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Suivi appels"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/administratif/courriers">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <MarkEmailReadIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Suivi courriers"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/administratif/reunions">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <AssignmentIcon/>
                  </ListItemIcon>
                  <ListItemText primary="CR Réunions"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/administratif/documents_trames">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <DescriptionIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Documents / Trames"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/administratif/lup">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <FormatListNumberedIcon/>
                  </ListItemIcon>
                  <ListItemText primary="LUP"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/administratif/sdr">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <MeetingRoomIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Salle de réunion"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'partnerships'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('partnerships')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <Construction/>
            </ListItemIcon>
            <ListItemText primary={'Services généraux'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('partnerships') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('partnerships')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledNavLink to="/online/travaux/interventions">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <EngineeringIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Interventions"/>
                </ListItemButton>
              </StyledNavLink>
              
              <ListItem key={'parc-automobile'} disablePadding sx={{display: 'block'}}>
                <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                                onClick={() => handleClickToOpenCategory('parc-automobile')}>
                  <ListItemIcon sx={{paddingLeft: 1.5, minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}>
                    <AirportShuttleIcon/> </ListItemIcon>
                  <ListItemText primary={'Parc automobile'} sx={{paddingLeft: 1, opacity: open ? 1 : 0}}/>
                  {openedCategory.includes('parc-automobile') ? <ExpandLess/> : <ChevronRight/>}
                </ListItemButton>
                <Collapse in={openedCategory.includes('parc-automobile')} sx={{backgroundColor: '#EFEFEF'}} timeout="auto"
                          unmountOnExit>
                  <List component="div" disablePadding>
                    <StyledNavLink to="/online/parc-automobile/vehicules">
                      <ListItemButton sx={{pl: 4}}>
                        <ListItemIcon>
                          <DirectionsCarFilled />
                        </ListItemIcon>
                        <ListItemText primary="Vehicules"/>
                      </ListItemButton>
                    </StyledNavLink>
                    <StyledNavLink to="/online/parc-automobile/controles-menssuels">
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <CarCrash />
                        </ListItemIcon>
                        <ListItemText primary="Contrôles menssuels" />
                      </ListItemButton>
                    </StyledNavLink>
                    <StyledNavLink to="/online/parc-automobile/controles-techniques">
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <Garage />
                        </ListItemIcon>
                        <ListItemText primary="Contrôles techniques" />
                      </ListItemButton>
                    </StyledNavLink>
                    <StyledNavLink to="/online/parc-automobile/reparations">
                      <ListItemButton sx={{pl: 4}}>
                        <ListItemIcon>
                          <CarRepair/>
                        </ListItemIcon>
                        <ListItemText primary="Suivi des réparations"/>
                      </ListItemButton>
                    </StyledNavLink>
                  </List>
                </Collapse>
              </ListItem>
              <StyledNavLink to="/online/partnerships/bâtiment-immobilier">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <HomeWorkIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Bâtiment / Immobilier"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/partnerships/bons-commande">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <PostAddIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Bons de commande"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/recuperations/objets">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <KeyIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Suivi des clés"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'sales'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('sales')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <CurrencyExchangeIcon/>
            </ListItemIcon>
            <ListItemText primary={'Finance'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('sales') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('sales')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledNavLink to="/online/sales/dépenses-engagements">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <AttachMoneyIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Dépenses et Engagements"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/sales/facturation-activité">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <RequestQuoteIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Facturation de l’activité"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/sales/budget">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <LocalAtmIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Budget"/>
                </ListItemButton>
              </StyledNavLink>
              <ListItem key={'trésorerie'} disablePadding sx={{display: 'block'}}>
                <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                                onClick={() => handleClickToOpenCategory('trésorerie')}>
                  <ListItemIcon sx={{paddingLeft: 1.5, minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}>
                    <SavingsIcon/> </ListItemIcon>
                  <ListItemText primary={'Trésorerie'} sx={{paddingLeft: 1, opacity: open ? 1 : 0}}/>
                  {openedCategory.includes('trésorerie') ? <ExpandLess/> : <ChevronRight/>}
                </ListItemButton>
                <Collapse in={openedCategory.includes('trésorerie')} sx={{backgroundColor: '#EFEFEF'}} timeout="auto"
                          unmountOnExit>
                  <List component="div" disablePadding>
                    <StyledNavLink to="/online/finance/tresorerie/comptes-bancaires">
                      <ListItemButton sx={{pl: 4}}>
                        <ListItemIcon>
                          <AccountBalance/>
                        </ListItemIcon>
                        <ListItemText primary="Comptes bancaires"/>
                      </ListItemButton>
                    </StyledNavLink>
                    <StyledNavLink to="/online/finance/tresorerie/soldes">
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <Money />
                        </ListItemIcon>
                        <ListItemText primary="Soldes" />
                      </ListItemButton>
                    </StyledNavLink>
                    <StyledNavLink to="/online/sales/caisse">
                      <ListItemButton sx={{pl: 4}}>
                        <ListItemIcon>
                          <PointOfSaleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Caisse"/>
                      </ListItemButton>
                    </StyledNavLink>
                  </List>
                </Collapse>
              </ListItem>
              <StyledNavLink to="/online/sales/diagnostic-financier">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <QueryStatsIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Diagnostic financier"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/sales/comptabilité">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <CalculateIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Comptabilité"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/sales/immobilisations">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <CreditCardOffIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Immobilisations"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/sales/révision-comptes">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <FactCheckIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Révision des comptes"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/finance/decisions">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <RateReviewIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Tarification"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'informatique'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('informatique')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <Computer/>
            </ListItemIcon>
            <ListItemText primary={'Informatique'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('informatique') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('informatique')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledNavLink to="/online/materiels">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <DevicesIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Matériels"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/logiciels">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <Microsoft/>
                  </ListItemIcon>
                  <ListItemText primary="Logiciel"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/tickets">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <EmailIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Ticket"/>
                </ListItemButton>
              </StyledNavLink>

              <ListItemButton sx={{pl: 4}} disabled>
                <ListItemIcon>
                  <SaveIcon/>
                </ListItemIcon>
                <ListItemText primary="Sauvegardes"/>

              </ListItemButton>
              <StyledNavLink to="/online/mots-de-passe">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <PasswordIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Mots de passe"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'achat'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('achat')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <ShoppingCartIcon/>
            </ListItemIcon>
            <ListItemText primary={'Achat'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('achat') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('achat')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledNavLink to="/online/achat/demande-achat-investissement">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <ShoppingBasketIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Demande d’achat / Investissement"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/achat/fournisseurs-vérifiés">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <HowToRegIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Fournisseurs vérifiés"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/achat/base-contrat">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <ContentPasteIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Base contrat"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/achat/mise-en-concurrence">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <ReduceCapacityIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Mise en concurrence"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'gouvernance'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('gouvernance')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <TableBarIcon/>
            </ListItemIcon>
            <ListItemText primary={'Gouvernance'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('gouvernance') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('gouvernance')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <StyledNavLink to="/online/gouvernance/membres">
                  <ListItemButton sx={{pl: 4}} >
                      <ListItemIcon>
                      <Group/>
                      </ListItemIcon>
                      <ListItemText primary="Membres"/>
                  </ListItemButton>
                </StyledNavLink>
              <StyledNavLink to="/online/gouvernance/reunions">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <TaskIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Procès-verbal"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'cse'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('cse')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <AccountBalanceIcon/>
            </ListItemIcon>
            <ListItemText primary={'CSE'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('cse') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('cse')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledNavLink to="/online/cse/membres">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <Group/>
                  </ListItemIcon>
                  <ListItemText primary="Membres"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/cse/procès-verbal">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <TaskIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Procès-verbal"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/cse/bdes">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <RequestQuoteIcon/>
                  </ListItemIcon>
                  <ListItemText primary="BDES"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'juridique'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('juridique')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <GavelIcon/>
            </ListItemIcon>
            <ListItemText primary={'Juridique'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('juridique') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('juridique')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledNavLink to="/online/juridique/casf">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <SourceIcon/>
                  </ListItemIcon>
                  <ListItemText primary="CASF"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/juridique/Code-associations-fondations">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <ImportContactsIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Code des associations et fondations"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/juridique/droit-travail">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <MenuBookIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Droit du travail"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/juridique/convention-collective">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <AutoStoriesIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Convention collective"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/juridique/accord-d’entreprise">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <StickyNote2Icon/>
                  </ListItemIcon>
                  <ListItemText primary="Accord d’entreprise"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}

        {!searchTerm && (
        <ListItem key={'ressources'} disablePadding sx={{display: 'block'}}>
          <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}
                          onClick={() => handleClickToOpenItem('ressources')}>
            <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}> <InventoryIcon/>
            </ListItemIcon>
            <ListItemText primary={'Ressources'} sx={{opacity: open ? 1 : 0}}/>
            {openedItems.includes('ressources') ? <ExpandLess/> : <ChevronRight/>}
          </ListItemButton>
          <Collapse in={openedItems.includes('ressources')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledNavLink to="/online/ressources/blog">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <StickyNote2Icon/>
                  </ListItemIcon>
                  <ListItemText primary="Blog"/>
                </ListItemButton>
              </StyledNavLink>
              <StyledNavLink to="/online/ressources/le-comptoir-des-essms">
                <ListItemButton sx={{pl: 4}}>
                  <ListItemIcon>
                    <NewspaperIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Le comptoir des ESSMS"/>
                </ListItemButton>
              </StyledNavLink>
            </List>
          </Collapse>
        </ListItem>
        )}
      </>
  );
}

function SecondaryListItems({open}) {

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

// function  MoreItems({open}){
//
//   const [openedItems, setOpenedItems] = React.useState(['partnerships', 'sales', 'purchases', 'gouvernance']);
//
//   const handleClickToOpenItem = (openedItem) => {
//     const isAlreadyOpened = openedItems.includes(openedItem);
//
//     if (isAlreadyOpened) {
//       setOpenedItems([]);
//     } else {
//       setOpenedItems([openedItem]);
//     }
//   };
//   return (
//     <>
//
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
     <StyledNavLink to="/online/parc-automobile/vehicules">
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
  //   </>
  // );
// }

export default function  ListItems({open}) {
  return (
    <>
      <List>
        <MainListItems open={open} />
      </List>
      <Divider/>
      <List>
          <SecondaryListItems open={open}/>
      </List>
    </>
  )
}