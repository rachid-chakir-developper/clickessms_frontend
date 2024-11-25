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

export default function EmployeeItemCard({
  employee,
  onDeleteEmployee,
  onUpdateEmployeeState,
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
    // navigate(`/online/ressources-humaines/employes/details/${employee?.id}`);
  }
  return (
    <Card
      variant="outlined"
      sx={{ position: 'relative', p: 1}}
    >
      <Tooltip title={employee?.name}>
        <Stack direction="row"
        sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2, cursor:'pointer' }}
        onClick={onGoToDetails}>
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={employee?.name}
            src={
              employee?.photo
                ? employee?.photo
                : '/default-placeholder.jpg'
            }
            sx={{ borderRadius: 0.6, height: 100, width: 100 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="column" spacing={0.2} alignItems="center">
            <Typography color="text.primary" fontWeight="medium" fontSize={18}>
              {`${employee?.firstName} ${employee?.preferredName && employee?.preferredName !== ''  ? employee?.preferredName : employee?.lastName}`}
            </Typography>
            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
              fontWeight="regular"
            >
              {`${employee?.position}`}
            </Typography>
            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
              fontWeight="regular"
            >
              {`${employee?.email}`}
            </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Tooltip>
      {/* <Stack direction="row" alignItems="start" spacing={1.5} sx={{position: 'absolute', top: 0, right: 0, zIndex: 10}}>
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
            {onDeleteEmployee && (
              <Tooltip title="Supprimer">
                <MenuItem
                  onClick={() => {onDeleteEmployee(employee?.id); handleCloseMenu()}}
                >
                  <Delete fontSize="small" />
                  Supprimer
                </MenuItem>
              </Tooltip>
            )}
            {onUpdateEmployeeState && (
              <Tooltip
                title={!employee?.isActive ? 'Activer' : 'Désactiver'}
              >
                <MenuItem
                  aria-label={!employee?.isActive ? 'play' : 'pause'}
                  onClick={() => {onUpdateEmployeeState(employee?.id); handleCloseMenu()}}
                >
                  {!employee?.isActive ? (
                    <PlayArrowRounded />
                  ) : (
                    <PauseRounded />
                  )}
                  {!employee?.isActive ? 'Activer' : 'Désactiver'}
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip title="Modifier">
              <Link
                to={`/online/ressources-humaines/employes/modifier/${employee?.id}`}
                className="no_style"
              >
                <MenuItem onClick={handleCloseMenu}>
                  <Edit fontSize="small" />
                  Modifier
                </MenuItem>
              </Link>
            </Tooltip>
            {employee?.folder && (
              <Tooltip title="Pièces jointes">
                <MenuItem
                  onClick={() => {onOpenDialogListLibrary(employee?.folder); handleCloseMenu()}}
                >
                  <Folder fontSize="small" />
                  Pièces jointes
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip title="Détails">
              <Link
                to={`/online/ressources-humaines/employes/details/${employee?.id}`}
                className="no_style"
              >
                <MenuItem onClick={handleCloseMenu}>
                  <AccountBox fontSize="small" />
                  Détails
                </MenuItem>
              </Link>
            </Tooltip>
          </Popover>
      </Stack> */}
    </Card>
  );
}
