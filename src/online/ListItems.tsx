import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { NavLink, useNavigate } from 'react-router-dom';
import { modules } from './navigation';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import InputBase from '@mui/material/InputBase';
import { useFeedBacks } from '../_shared/context/feedbacks/FeedBacksProvider';
import { LOGOUT_USER } from '../_shared/graphql/mutations/AuthMutations';
import { useMutation } from '@apollo/client';
import { useSessionDispatch } from '../_shared/context/SessionProvider';
import { useState } from 'react';
import {
  HighlightableCategory,
  HighlightableModule,
  HighlightablePage,
  filterModules,
} from './navigationSearch';

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

interface EntryProps {
  icon: React.ReactNode;
  name: string;
  path?: string;
  expandable?: boolean;
  open?: boolean;
  disabled?: boolean;
  indented?: boolean;
  highlighted?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

function Entry(props: EntryProps) {
  const button = (
    <ListItemButton
      sx={{ px: 2.5 }}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <ListItemIcon sx={{ pl: props.indented ? 1.5 : 0 }}>
        {props.icon}
      </ListItemIcon>
      <ListItemText
        primary={props.name}
        primaryTypographyProps={
          props.highlighted
            ? {
                fontWeight: 'bold',
              }
            : {}
        }
      />
      {props.expandable && (props.open ? <ExpandLess /> : <ChevronRight />)}
    </ListItemButton>
  );

  const maybeLink =
    !props.disabled && props.path ? (
      <StyledNavLink to={props.path}>{button}</StyledNavLink>
    ) : (
      button
    );

  const children = props.expandable ? (
    <Collapse in={props.open} timeout="auto" unmountOnExit>
      {props.children}
    </Collapse>
  ) : (
    props.children
  );

  const item = (
    <ListItem disablePadding sx={{ display: 'block' }}>
      {maybeLink}
      {children}
    </ListItem>
  );
  return item;
}

function PageNavEntry(props: HighlightablePage) {
  return (
    <Entry
      icon={props.icon}
      name={props.name}
      path={props.path}
      disabled={props.disabled}
      highlighted={props.highlighted}
      indented
    />
  );
}

interface CategoryNavEntryProps extends HighlightableCategory {
  open?: boolean;
  onToggleExpand: (key: string, open: boolean) => void;
}

function CategoryNavEntry(props: CategoryNavEntryProps) {
  return (
    <Entry
      icon={props.icon}
      name={props.name}
      highlighted={props.highlighted}
      indented
      onClick={() => {
        props.onToggleExpand(props.id, Boolean(props.open));
      }}
      expandable
      open={props.open}
    >
      <List disablePadding sx={{ backgroundColor: '#EFEFEF' }}>
        {props.pages.map((page) => (
          <PageNavEntry
            key={page.id}
            id={page.id}
            name={page.name}
            path={page.path}
            icon={page.icon}
            disabled={page.disabled}
            highlighted={page.highlighted}
          />
        ))}
      </List>
    </Entry>
  );
}

interface ModuleNavEntryProps extends HighlightableModule {
  open?: boolean;
  onToggleExpand: (key: string, open: boolean) => void;
}

function ModuleNavEntry(props: ModuleNavEntryProps) {
  const [openedCategory, setOpenedCategory] = useState('');

  function onToggleExpand(key: string) {
    if (key === openedCategory) {
      setOpenedCategory('');
    } else {
      setOpenedCategory(key);
    }
  }

  return (
    <Entry
      icon={props.icon}
      name={props.name}
      highlighted={props.highlighted}
      onClick={() => {
        props.onToggleExpand(props.id, Boolean(props.open));
      }}
      expandable
      open={props.open}
    >
      <List disablePadding>
        {props.entries.map((entry) => {
          if ('pages' in entry) {
            return (
              <CategoryNavEntry
                key={entry.id}
                id={entry.id}
                name={entry.name}
                icon={entry.icon}
                pages={entry.pages}
                highlighted={entry.highlighted}
                onToggleExpand={onToggleExpand}
                open={openedCategory === entry.id}
              />
            );
          }
          return (
            <PageNavEntry
              key={entry.id}
              path={entry.path}
              id={entry.id}
              name={entry.name}
              icon={entry.icon}
              disabled={entry.disabled}
              highlighted={entry.highlighted}
            />
          );
        })}
      </List>
    </Entry>
  );
}

export function MainListItems({ searchTerm }: { searchTerm: string }) {
  const [openedModule, setOpenedModule] = useState('');

  function onToggleExpand(key: string) {
    if (key === openedModule) {
      setOpenedModule('');
    } else {
      setOpenedModule(key);
    }
  }

  const filteredModules: HighlightableModule[] = searchTerm
    ? filterModules(modules, searchTerm)
    : modules;

  return (
    <List>
      {filteredModules.map((module) => (
        <ModuleNavEntry
          key={module.id}
          id={module.id}
          entries={module.entries}
          name={module.name}
          icon={module.icon}
          highlighted={module.highlighted}
          onToggleExpand={onToggleExpand}
          open={openedModule === module.id}
        />
      ))}
    </List>
  );
}

function SearchEntry({ searchTerm, onSearch }) {
  function handleChange(event) {
    onSearch(event.target.value);
  }

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <Stack sx={{ px: 2.5, py: 1 }} direction="row" alignItems="center">
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <InputBase
          placeholder="Rechercher..."
          inputProps={{ 'aria-label': 'search' }}
          value={searchTerm}
          onChange={handleChange}
        />
      </Stack>
    </ListItem>
  );
}

function HeaderListItems({
  searchTerm,
  onSearch,
}: {
  searchTerm: string;
  onSearch(term: string): void;
}) {
  return (
    <List>
      <SearchEntry searchTerm={searchTerm} onSearch={onSearch} />
      <Entry
        path="/online/dashboard"
        key="dashboard"
        name="Tableau de bord"
        icon={<DashboardIcon />}
      />
    </List>
  );
}

function FooterListItems() {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const dispatch = useSessionDispatch();
  const [logoutUser, { loading: loadingLogout }] = useMutation(LOGOUT_USER, {
    onCompleted: (datas) => {
      if (datas.logoutUser.done) {
        // empty
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
    <List>
      <Entry
        path="/online/utilisateurs"
        key="users"
        name="Utilisateurs"
        icon={<PersonIcon />}
      />
      <Entry
        path="/online/parametres"
        key="settings"
        name="Paramètres"
        icon={<SettingsIcon />}
      />
      <Entry
        key="logout"
        name="Se déconnecter"
        icon={<PowerSettingsNewIcon />}
        onClick={onLogoutUser}
      />
    </List>
  );
}

export default function ListItems() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <HeaderListItems searchTerm={searchTerm} onSearch={setSearchTerm} />
      <Divider />
      <MainListItems searchTerm={searchTerm} />
      <Divider />
      <FooterListItems />
    </>
  );
}
