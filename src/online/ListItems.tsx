import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { NavLink, useNavigate } from 'react-router-dom';
import { Category, Module, Page, modules } from './navigation';
import Divider from '@mui/material/Divider';
import { Collapse } from '@mui/material';
import { useFeedBacks } from '../_shared/context/feedbacks/FeedBacksProvider';
import { LOGOUT_USER } from '../_shared/graphql/mutations/AuthMutations';
import { useMutation } from '@apollo/client';
import { useSessionDispatch } from '../_shared/context/SessionProvider';
import { useState } from 'react';

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
      <ListItemText primary={props.name} />
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

function PageNavEntry(props: Page) {
  return (
    <Entry
      icon={props.icon}
      name={props.name}
      path={props.path}
      disabled={props.disabled}
      indented
    />
  );
}

interface CategoryNavEntryProps extends Category {
  open?: boolean;
  onToggleExpand: (key: string, open: boolean) => void;
}

function CategoryNavEntry(props: CategoryNavEntryProps) {
  return (
    <Entry
      icon={props.icon}
      name={props.name}
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
          />
        ))}
      </List>
    </Entry>
  );
}

interface ModuleNavEntryProps extends Module {
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
            />
          );
        })}
      </List>
    </Entry>
  );
}

export function MainListItems() {
  const [openedModule, setOpenedModule] = useState('');

  function onToggleExpand(key: string) {
    if (key === openedModule) {
      setOpenedModule('');
    } else {
      setOpenedModule(key);
    }
  }

  return (
    <div>
      {modules.map((module) => (
        <ModuleNavEntry
          key={module.id}
          id={module.id}
          entries={module.entries}
          name={module.name}
          icon={module.icon}
          onToggleExpand={onToggleExpand}
          open={openedModule === module.id}
        />
      ))}
    </div>
  );
}

function SecondaryListItems() {
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
    <>
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
    </>
  );
}

export default function ListItems() {
  return (
    <>
      <List>
        <MainListItems />
      </List>
      <Divider />
      <List>
        <SecondaryListItems />
      </List>
    </>
  );
}
