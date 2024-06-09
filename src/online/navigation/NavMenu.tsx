import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useNavigate } from 'react-router-dom';
import { modules } from './modules';
import Divider from '@mui/material/Divider';
import { useFeedBacks } from '../../_shared/context/feedbacks/FeedBacksProvider';
import { LOGOUT_USER } from '../../_shared/graphql/mutations/AuthMutations';
import { useMutation } from '@apollo/client';
import { useSessionDispatch } from '../../_shared/context/SessionProvider';
import { useState } from 'react';
import {
  HighlightableSubmodule,
  HighlightableModule,
  HighlightablePage,
  filterModules,
} from './search';
import NavEntry from './NavEntry';
import SearchEntry from './SearchEntry';

export default function NavMenu() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <NavMenuHeader searchTerm={searchTerm} onSearch={setSearchTerm} />
      <Divider />
      <NavMenuMain searchTerm={searchTerm} />
      <Divider />
      <NavMenuFooter />
    </>
  );
}

function PageNavEntry(props: HighlightablePage) {
  return (
    <NavEntry
      icon={props.icon}
      name={props.name}
      path={props.path}
      disabled={props.disabled}
      highlighted={props.highlighted}
      indented
    />
  );
}

interface SubmoduleNavEntryProps extends HighlightableSubmodule {
  expanded?: boolean;
  onToggleExpand: (key: string, expanded: boolean) => void;
}

function SubmoduleNavEntry(props: SubmoduleNavEntryProps) {
  return (
    <NavEntry
      icon={props.icon}
      name={props.name}
      highlighted={props.highlighted}
      indented
      onClick={() => {
        props.onToggleExpand(props.id, Boolean(props.expanded));
      }}
      expandable
      expanded={props.expanded}
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
    </NavEntry>
  );
}

interface ModuleNavEntryProps extends HighlightableModule {
  expanded?: boolean;
  onToggleExpand: (key: string, expanded: boolean) => void;
}

function ModuleNavEntry(props: ModuleNavEntryProps) {
  const [openedSubmodule, setOpenedSubmodule] = useState('');

  function onToggleExpand(key: string) {
    if (key === openedSubmodule) {
      setOpenedSubmodule('');
    } else {
      setOpenedSubmodule(key);
    }
  }

  return (
    <NavEntry
      icon={props.icon}
      name={props.name}
      highlighted={props.highlighted}
      onClick={() => {
        props.onToggleExpand(props.id, Boolean(props.expanded));
      }}
      expandable
      expanded={props.expanded}
    >
      <List disablePadding>
        {props.entries.map((entry) => {
          if ('pages' in entry) {
            return (
              <SubmoduleNavEntry
                key={entry.id}
                id={entry.id}
                name={entry.name}
                icon={entry.icon}
                pages={entry.pages}
                highlighted={entry.highlighted}
                onToggleExpand={onToggleExpand}
                expanded={openedSubmodule === entry.id}
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
    </NavEntry>
  );
}

function NavMenuMain({ searchTerm }: { searchTerm: string }) {
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
          expanded={openedModule === module.id}
        />
      ))}
    </List>
  );
}

function NavMenuHeader({
  searchTerm,
  onSearch,
}: {
  searchTerm: string;
  onSearch(term: string): void;
}) {
  return (
    <List>
      <SearchEntry searchTerm={searchTerm} onSearch={onSearch} />
      <NavEntry
        path="/online/dashboard"
        key="dashboard"
        name="Tableau de bord"
        icon={<DashboardIcon />}
      />
    </List>
  );
}

function NavMenuFooter() {
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
      <NavEntry
        path="/online/utilisateurs"
        key="users"
        name="Utilisateurs"
        icon={<PersonIcon />}
      />
      <NavEntry
        path="/online/parametres"
        key="settings"
        name="Paramètres"
        icon={<SettingsIcon />}
      />
      <NavEntry
        key="logout"
        name="Se déconnecter"
        icon={<PowerSettingsNewIcon />}
        onClick={onLogoutUser}
      />
    </List>
  );
}
