import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useNavigate } from 'react-router-dom';
import { modules } from './modules';
import Divider from '@mui/material/Divider';
import { useFeedBacks } from '../../_shared/context/feedbacks/FeedBacksProvider';
import { LOGOUT_USER } from '../../_shared/graphql/mutations/AuthMutations';
import { useMutation } from '@apollo/client';
import { useSessionDispatch } from '../../_shared/context/SessionProvider';
import { useEffect, useState } from 'react';
import {
  SubmoduleViewModel,
  ModuleViewModel,
  PageViewModel,
  filterModulesForSearch,
} from './search';
import NavEntry from './NavEntry';
import SearchEntry from './SearchEntry';
import { filterMap } from '../../_shared/tools/functions';
import { useAuthorizationSystem } from '../../_shared/context/AuthorizationSystemProvider';

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

function PageNavEntry(props: PageViewModel) {
  return (
    <NavEntry
      icon={props.icon}
      name={props.name}
      path={props.path}
      disabled={props.disabled}
      hidden={props.hidden}
      highlighted={props.highlighted}
      indented
    />
  );
}

interface SubmoduleNavEntryProps extends SubmoduleViewModel {
  animateExpand?: boolean;
  onToggleExpand: (key: string, expanded: boolean) => void;
}

function SubmoduleNavEntry(props: SubmoduleNavEntryProps) {
  return (
    <NavEntry
      icon={props.icon}
      name={props.name}
      highlighted={props.highlighted}
      disabled={props.disabled}
      hidden={props.hidden}
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
            hidden={page.hidden}
            highlighted={page.highlighted}
          />
        ))}
      </List>
    </NavEntry>
  );
}

interface ModuleNavEntryProps extends ModuleViewModel {
  animateExpand?: boolean;
  onModuleToggleExpand(moduleId: string, expanded: boolean): void;
  onSubmoduleToggleExpand(
    moduleId: string,
    submoduleId: string,
    expanded: boolean,
  ): void;
}

function ModuleNavEntry(props: ModuleNavEntryProps) {
  return (
    <NavEntry
      icon={props.icon}
      name={props.name}
      highlighted={props.highlighted}
      disabled={props.disabled}
      onClick={() => {
        props.onModuleToggleExpand(props.id, Boolean(props.expanded));
      }}
      expandable
      expanded={props.expanded}
      animateExpand={props.animateExpand}
      hidden={props.hidden}
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
                onToggleExpand={() => {
                  props.onSubmoduleToggleExpand(
                    props.id,
                    entry.id,
                    Boolean(entry.expanded),
                  );
                }}
                disabled={entry.disabled}
                hidden={entry.hidden}
                expanded={entry.expanded}
                animateExpand={props.animateExpand}
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
              hidden={entry.hidden}
              highlighted={entry.highlighted}
            />
          );
        })}
      </List>
    </NavEntry>
  );
}

function filterOutDisabledEntries(
  modules: ModuleViewModel[],
): ModuleViewModel[] {
  return filterMap(modules, (module) => {
    const entries = filterMap(module.entries, (entry) => {
      if ('pages' in entry) {
        const pages = filterMap(entry.pages, (page) => {
          return page.disabled ? undefined : page;
        });
        return pages.length > 0 ? { ...entry, pages } : undefined;
      }
      return entry.disabled ? undefined : entry;
    });
    if (entries.length === 0) {
      return undefined;
    }
    return { ...module, entries };
  });
}

function NavMenuMain({ searchTerm }: { searchTerm: string }) {
  const [viewModel, setViewModel] = useState<ModuleViewModel[]>(modules);

  // Filter the entries every time the search term changes
  useEffect(() => {
    if (searchTerm) {
      setViewModel(
        filterOutDisabledEntries(filterModulesForSearch(modules, searchTerm)),
      );
    } else {
      setViewModel(modules);
    }
  }, [searchTerm]);

  function onModuleToggleExpand(moduleId: string, expanded: boolean) {
    setViewModel((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          return { ...module, expanded: !expanded };
        }
        if (!searchTerm) {
          return { ...module, expanded: false };
        }
        return module;
      }),
    );
  }

  function onSubmoduleToggleExpand(
    moduleId: string,
    submoduleId: string,
    expanded: boolean,
  ) {
    setViewModel((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            entries: module.entries.map((entry) => {
              if (entry.id === submoduleId) {
                return { ...entry, expanded: !expanded };
              }
              if (!searchTerm && 'pages' in entry) {
                return { ...entry, expanded: false };
              }
              return entry;
            }),
          };
        }
        return module;
      }),
    );
  }

  return (
    <List>
      {viewModel.map((module) => (
        <ModuleNavEntry
          key={module.id}
          id={module.id}
          entries={module.entries}
          name={module.name}
          icon={module.icon}
          highlighted={module.highlighted}
          onModuleToggleExpand={onModuleToggleExpand}
          onSubmoduleToggleExpand={onSubmoduleToggleExpand}
          expanded={module.expanded}
          animateExpand={!searchTerm}
          disabled={module.disabled}
          hidden={module.hidden}
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
  const authorizationSystem = useAuthorizationSystem();
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
        hidden={()=> !authorizationSystem.requestAuthorization({
            type: 'manageSettings',
          }).authorized
        }
      />
      <NavEntry
        path="/online/parametres"
        key="settings"
        name="Paramètres"
        icon={<SettingsIcon />}
        hidden={()=> !authorizationSystem.requestAuthorization({
            type: 'manageSettings',
          }).authorized
        }
      />
      <NavEntry
        path="/online/roberp"
        key="roberp"
        name="Support"
        icon={<SupportAgentIcon />}
      />
      <NavEntry
        key="logout"
        name="Se déconnecter"
        icon={<PowerSettingsNewIcon />}
        onClick={onLogoutUser}
        disabled={loadingLogout}
      />
    </List>
  );
}
