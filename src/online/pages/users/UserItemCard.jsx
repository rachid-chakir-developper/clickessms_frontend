import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, Stack, Tooltip } from '@mui/material';
import {
  Delete,
  PauseRounded,
  PlayArrowRounded,
  Edit,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function UserItemCard({
  user,
  onDeleteUser,
  onUpdateUserState,
}) {
  //   const theme = useTheme();
  const [paused, setPaused] = React.useState(false);
  return (
    <Card
      variant="outlined"
      sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}
    >
      <Tooltip title={`${user?.firstName} ${user?.lastName}`}>
        <CardMedia
          component="img"
          width="100"
          height="100"
          alt={`${user?.firstName} ${user?.lastName}`}
          src={user?.photo ? user?.photo : '/default-placeholder.jpg'}
          sx={{ borderRadius: 0.6, height: 100, width: 100 }}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {`${user?.firstName} ${user?.lastName}`}
          </Typography>
          <Typography
            component="div"
            variant="caption"
            color="text.secondary"
            fontWeight="regular"
          >
            {`${user?.email}`}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {user?.employee && (
            <Tooltip
              title={`L'employé: ${user?.employee?.firstName} ${user?.employee?.lastName}`}
            >
              <Link
                to={`/online/employes/details/${user?.employee?.id}`}
                className="no_style"
              >
                <Avatar
                  alt={`${user?.employee?.firstName} ${user?.employee?.lastName}`}
                  src={user?.employee?.photo}
                />
              </Link>
            </Tooltip>
          )}
          <Tooltip title="Supprimer">
            <IconButton
              aria-label="delete"
              size="small"
              sx={{ flexGrow: 0 }}
              onClick={() => onDeleteUser(user?.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={!user?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!user?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateUserState(user?.id)}
            >
              {!user?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link
              to={`/online/utilisateurs/modifier/${user?.id}`}
              className="no_style"
            >
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
