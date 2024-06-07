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
  Folder,
  AccountBox,
  MoreVert,
  Article,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

export default function VehicleItemCard({
  vehicle,
  onDeleteVehicle,
  onUpdateVehicleState,
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
  const { setDialogListLibrary } = useFeedBacks();
  const onOpenDialogListLibrary = (folderParent) => {
    setDialogListLibrary({
      isOpen: true,
      folderParent,
      onClose: () => {
        setDialogListLibrary({ isOpen: false });
      },
    });
  };
  const onGoToDetails = ()=>{
    navigate(`/online/parc-automobile/vehicules/details/${vehicle?.id}`);
  }
  return (
    <Card
      variant="outlined"
      sx={{ position: 'relative'}}
    >
      <Tooltip title={vehicle?.name}>
        <Stack direction="row"
        sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2, cursor:'pointer' }}
        onClick={onGoToDetails}>
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={vehicle?.name}
            src={
              vehicle?.image
                ? vehicle?.image
                : '/default-placeholder.jpg'
            }
            sx={{ borderRadius: 0.6, height: 100, width: 100 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="column" spacing={0.2} alignItems="center">
              <Typography color="text.primary" fontWeight="medium" fontSize={18}>
                {vehicle?.name}
              </Typography>
              {vehicle?.vehicleBrand && <Typography
                component="div"
                variant="caption"
                color="text.secondary"
                fontWeight="regular"
              >
                {`${vehicle?.vehicleBrand?.name} ${vehicle?.vehicleModel?.name}`}
              </Typography>}
              <Typography color="text.primary" fontWeight="regular" fontSize={14}>
                <b>{vehicle?.registrationNumber}</b>
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
              {vehicle?.vehicleParent && (
              <Tooltip
                title={`L'éstablishment parent: ${vehicle?.vehicleParent?.name}`}
              >
                <Link
                  to={`/online/parc-automobile/vehicules/details/${vehicle?.vehicleParent?.id}`}
                  className="no_style"
                >
                  <MenuItem onClick={handleCloseMenu}>
                    <Avatar
                      alt={`${vehicle?.vehicleParent?.name}`}
                      src={vehicle?.vehicleParent?.image}
                    />
                  </MenuItem>
                </Link>
              </Tooltip>
            )}
            {onDeleteVehicle && (
              <Tooltip title="Supprimer">
                <MenuItem
                  onClick={() => {onDeleteVehicle(vehicle?.id); handleCloseMenu()}}
                >
                  <Delete fontSize="small" />
                  Supprimer
                </MenuItem>
              </Tooltip>
            )}
            {onUpdateVehicleState && (
              <Tooltip
                title={!vehicle?.isActive ? 'Activer' : 'Désactiver'}
              >
                <MenuItem
                  aria-label={!vehicle?.isActive ? 'play' : 'pause'}
                  onClick={() => {onUpdateVehicleState(vehicle?.id); handleCloseMenu()}}
                >
                  {!vehicle?.isActive ? (
                    <PlayArrowRounded />
                  ) : (
                    <PauseRounded />
                  )}
                  {!vehicle?.isActive ? 'Activer' : 'Désactiver'}
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip title="Modifier">
              <Link
                to={`/online/parc-automobile/vehicules/modifier/${vehicle?.id}`}
                className="no_style"
              >
                <MenuItem onClick={handleCloseMenu}>
                  <Edit fontSize="small" />
                  Modifier
                </MenuItem>
              </Link>
            </Tooltip>
            {vehicle?.folder && (
              <Tooltip title="Pièces jointes">
                <MenuItem
                  onClick={() => {onOpenDialogListLibrary(vehicle?.folder); handleCloseMenu()}}
                >
                  <Folder fontSize="small" />
                  Pièces jointes
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip title="Détails">
              <Link
                to={`/online/parc-automobile/vehicules/details/${vehicle?.id}`}
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
