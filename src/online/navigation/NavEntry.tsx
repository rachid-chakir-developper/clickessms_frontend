import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  CurrentAuthorizationSystem,
  useAuthorizationSystem,
} from '../../_shared/context/AuthorizationSystemProvider';

import { useSession } from '../../_shared/context/SessionProvider';

export interface NavEntryProps {
  id: string;
  icon: React.ReactNode;
  name: string;
  /** If a path is provided, the entry is wrapped in a link */
  path?: string | ((session: any) => string);
  /** If a path is provided, the entry is wrapped in a link */
  target?: string;
  /**
   * Adds an arrow at the end, to implement entries with collapsible
   * sub-entries. The component does not handle the expansion logic itself.
   */
  expandable?: boolean;
  /**
   * Whether the entry must show as expanded. Only relevent if `expandable`
   * is true.
   */
  expanded?: boolean;
  /**
   * Whether to enable animate when the entry is expanded or collapsed.
   */
  animateExpand?: boolean;
  /**
   * Callback to handle the click event. Most useful to implement the
   * expansion logic for expandable entries, but can be used for other
   * purposes.
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /**
   * If `true`, entry is greyed out and cannot be clicked.
   */
  disabled?:
    | boolean
    | ((authorizationSystem: CurrentAuthorizationSystem) => boolean);
  /**
   * If `true`, entry is hidden.
   */
  hidden?:
    | boolean
    | ((authorizationSystem: CurrentAuthorizationSystem) => boolean);
  /**
   * Adds padding to the left of the entry, to indicate a hierarchy.
   */
  indented?: boolean;
  /**
   * If `true`, the entry is highlighted, meaning that its text is bold.
   * Useful to highlight search results.
   */
  highlighted?: boolean;
  /**
   * Children are appended to the entry, inside the `ListItem`. Most useful
   * to pass sub-entries in an expandable entry.
   */
  children?: React.ReactNode;
}

/**
 * A generic component to render entries in the navigation menu.
 */
export default function NavEntry(props: NavEntryProps) {
  const authorizationSystem = useAuthorizationSystem();
  const session = useSession();
  const {user}= session

  const [animateExpand, setAnimateExpand] = useState(props.animateExpand);

  // Introduce a delay to prevent the animation from playing immediately when
  // the value is set back to `true`.
  useEffect(() => {
    const newValue = props.animateExpand;
    if (newValue) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateExpand(newValue);
        });
      });
    } else {
      setAnimateExpand(newValue);
    }
  }, [props.animateExpand]);

  const disabled = typeof props.disabled === 'function' ? props.disabled(authorizationSystem) : props.disabled;
  const hidden = typeof props.hidden === 'function' ? props.hidden(authorizationSystem) : props.hidden;
  const path = typeof props.path === 'function' ? props.path(session) : props.path;
  const button = (
    <ListItemButton
      sx={{ px: 2.5 }}
      disabled={disabled}
      onClick={props.onClick}
    >
      <ListItemIcon sx={{ pl: props.indented ? 1.5 : 0 }}>
        {props.icon}
      </ListItemIcon>
      <ListItemText
        primary={props.name}
        primaryTypographyProps={props.highlighted ? { fontWeight: 'bold' } : {}}
      />
      {props.expandable && (props.expanded ? <ExpandMore /> : <ChevronRight />)}
    </ListItemButton>
  );

  const maybeLink =
    !disabled && path ? (
      <StyledNavLink to={path} target={props.target}>{button}</StyledNavLink>
    ) : (
      button
    );

  const children = props.expandable ? (
    <Collapse
      in={props.expanded}
      timeout={animateExpand ? 'auto' : 0}
      unmountOnExit
    >
      {props.children}
    </Collapse>
  ) : (
    props.children
  );
  
  const item = (!hidden && !user.company?.companyHiddenModules?.includes(props.id)) && (
    <ListItem disablePadding sx={{ display: 'block' }}>
      {maybeLink}
      {children}
    </ListItem>
  );
  return item;
}

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
