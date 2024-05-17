import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, MenuItem, Popover, Stack, Tooltip } from '@mui/material';
import {
  Delete,
  PauseRounded,
  PlayArrowRounded,
  Edit,
  AccountBox,
  MoreVert,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { getFormatDateTime } from '../../../../../_shared/tools/functions';

export default function EmployeeGroupItemCard({
  employeeGroup,
  onDeleteEmployeeGroup,
  onUpdateEmployeeGroupState,
}) {
  //   const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const onGoToDetails = ()=>{
    navigate(`/online/ressources-humaines/employes/groupes/details/${employeeGroup?.id}`);
  }
  return (
    <Card
      variant="outlined"
      sx={{ position: 'relative', p: 1}}
    >
      <Tooltip title={employeeGroup?.name}>
        <Stack direction="row"
        sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2, cursor:'pointer' }}
        onClick={onGoToDetails}>
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={employeeGroup?.name}
            src={
              employeeGroup?.image
                ? employeeGroup?.image
                : '/default-placeholder.jpg'
            }
            sx={{ borderRadius: 0.6, height: 100, width: 100 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="column" spacing={0.2} alignItems="center">
                <Typography color="text.primary" fontWeight="medium" fontSize={18}>
                  {employeeGroup?.name}
                </Typography>
                <Typography
                  component="div"
                  variant="caption"
                  color="text.secondary"
                  fontWeight="regular"
                >
                  À {`${getFormatDateTime(employeeGroup?.startingDateTime)}`}
                </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Tooltip>
      <Stack direction="row" alignItems="start" spacing={1.5} sx={{position: 'absolute', top: 0, right: 0, zIndex: 10}}>
          <IconButton onClick={handleOpenMenu}>
              <MoreVert />
          </IconButton>
          <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
              {employeeGroup?.employeeGroupParent && (
              <Tooltip
                title={`L'éstablishment parent: ${employeeGroup?.employeeGroupParent?.name}`}
              >
                <Link
                  to={`/online/ressources-humaines/employes/groupes/details/${employeeGroup?.employeeGroupParent?.id}`}
                  className="no_style"
                >
                  <MenuItem onClick={handleCloseMenu}>
                    <Avatar
                      alt={`${employeeGroup?.employeeGroupParent?.name}`}
                      src={employeeGroup?.employeeGroupParent?.image}
                    />
                  </MenuItem>
                </Link>
              </Tooltip>
            )}
            {onDeleteEmployeeGroup && (
              <Tooltip title="Supprimer">
                <MenuItem
                  onClick={() => {onDeleteEmployeeGroup(employeeGroup?.id); handleCloseMenu()}}
                >
                  <Delete fontSize="small" />
                  Supprimer
                </MenuItem>
              </Tooltip>
            )}
            {onUpdateEmployeeGroupState && (
              <Tooltip
                title={!employeeGroup?.isActive ? 'Activer' : 'Désactiver'}
              >
                <MenuItem
                  aria-label={!employeeGroup?.isActive ? 'play' : 'pause'}
                  onClick={() => {onUpdateEmployeeGroupState(employeeGroup?.id); handleCloseMenu()}}
                >
                  {!employeeGroup?.isActive ? (
                    <PlayArrowRounded />
                  ) : (
                    <PauseRounded />
                  )}
                  {!employeeGroup?.isActive ? 'Activer' : 'Désactiver'}
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip title="Modifier">
              <Link
                to={`/online/ressources-humaines/employes/groupes/modifier/${employeeGroup?.id}`}
                className="no_style"
              >
                <MenuItem onClick={handleCloseMenu}>
                  <Edit fontSize="small" />
                  Modifier
                </MenuItem>
              </Link>
            </Tooltip>
            <Tooltip title="Détails">
              <Link
                to={`/online/ressources-humaines/employes/groupes/details/${employeeGroup?.id}`}
                className="no_style"
              >
                <MenuItem onClick={handleCloseMenu}>
                  <AccountBox fontSize="small" />
                  Détails
                </MenuItem>
              </Link>
            </Tooltip>
          </Popover>
      </Stack>
    </Card>
  );
}
