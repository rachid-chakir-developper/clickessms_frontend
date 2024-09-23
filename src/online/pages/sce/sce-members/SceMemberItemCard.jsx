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

import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { getCSERoleLabel } from '../../../../_shared/tools/functions';

export default function SceMemberItemCard({
  sceMember,
  onDeleteSceMember,
  onUpdateSceMemberState,
}) {
  //   const theme = useTheme();
  const authorizationSystem = useAuthorizationSystem();
  const canManageSce = authorizationSystem.requestAuthorization({
    type: 'manageSce',
  }).authorized;
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
    navigate(`/online/cse/membres/details/${sceMember?.id}`);
  }
  return (
    <Card
      variant="outlined"
      sx={{ position: 'relative', p: 1}}
    >
      <Tooltip title={sceMember?.employee?.name}>
        <Stack direction="row"
        sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2, cursor:'pointer' }}
        onClick={onGoToDetails}>
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={sceMember?.employee?.name}
            src={
              sceMember?.employee?.photo
                ? sceMember?.employee?.photo
                : '/default-placeholder.jpg'
            }
            sx={{ borderRadius: 0.6, height: 100, width: 100 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="column" spacing={0.2} alignItems="center">
            <Typography color="text.primary" fontWeight="medium" fontSize={18}>
              {`${sceMember?.employee?.firstName} ${sceMember?.employee?.lastName}`}
            </Typography>
            {sceMember?.employee?.position && <Typography
              component="div"
              variant="caption"
              color="text.secondary"
              fontWeight="regular"
            >
              {`${sceMember?.employee?.position}`}
            </Typography>}
            {sceMember?.employee?.email && <Typography
              component="div"
              variant="caption"
              color="text.secondary"
              fontWeight="regular"
            >
              {`${sceMember?.employee?.email}`}
            </Typography>}
            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
              fontWeight="regular"
            >
              {getCSERoleLabel(sceMember?.role)}
            </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Tooltip>
      {canManageSce && <Stack direction="row" alignItems="start" spacing={1.5} sx={{position: 'absolute', top: 0, right: 0, zIndex: 10}}>
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
            {onDeleteSceMember && (
              <Tooltip title="Supprimer">
                <MenuItem
                  onClick={() => {onDeleteSceMember(sceMember?.id); handleCloseMenu()}}
                >
                  <Delete fontSize="small" />
                  Supprimer
                </MenuItem>
              </Tooltip>
            )}
            {onUpdateSceMemberState && (
              <Tooltip
                title={!sceMember?.employee?.isActive ? 'Activer' : 'Désactiver'}
              >
                <MenuItem
                  aria-label={!sceMember?.employee?.isActive ? 'play' : 'pause'}
                  onClick={() => {onUpdateSceMemberState(sceMember?.id); handleCloseMenu()}}
                >
                  {!sceMember?.employee?.isActive ? (
                    <PlayArrowRounded />
                  ) : (
                    <PauseRounded />
                  )}
                  {!sceMember?.employee?.isActive ? 'Activer' : 'Désactiver'}
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip title="Modifier">
              <Link
                to={`/online/cse/membres/modifier/${sceMember?.id}`}
                className="no_style"
              >
                <MenuItem onClick={handleCloseMenu}>
                  <Edit fontSize="small" />
                  Modifier
                </MenuItem>
              </Link>
            </Tooltip>
            {sceMember?.employee?.folder && (
              <Tooltip title="Pièces jointes">
                <MenuItem
                  onClick={() => {onOpenDialogListLibrary(sceMember?.employee?.folder); handleCloseMenu()}}
                >
                  <Folder fontSize="small" />
                  Pièces jointes
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip title="Détails">
              <Link
                to={`/online/cse/membres/details/${sceMember?.id}`}
                className="no_style"
              >
                <MenuItem onClick={handleCloseMenu}>
                  <AccountBox fontSize="small" />
                  Détails
                </MenuItem>
              </Link>
            </Tooltip>
          </Popover>
      </Stack>}
    </Card>
  );
}
