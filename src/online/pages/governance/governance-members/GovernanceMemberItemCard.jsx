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
  Archive,
  Unarchive,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import OpenLibraryButton from '../../../_shared/components/library/OpenLibraryButton ';
import { getFormatDate, getGovernanceRoleLabel } from '../../../../_shared/tools/functions';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';

export default function GovernanceMemberItemCard({
  governanceMember,
  onDeleteGovernanceMember,
  onUpdateGovernanceMemberState,
  onUpdateGovernanceMemberFields,
}) {
  const authorizationSystem = useAuthorizationSystem();
  const canManageGovernance = authorizationSystem.requestAuthorization({
    type: 'manageGovernance',
  }).authorized;
  //   const theme = useTheme();
  const {lastGovernanceMemberRole } = governanceMember
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
    navigate(`/online/gouvernance/membres/details/${governanceMember?.id}`);
  }
  return (
    <Card
      variant="outlined"
      sx={{ position: 'relative', p: 1}}
    >
      <Tooltip title={governanceMember?.name}>
        <Stack direction="row"
        sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2, cursor:'pointer' }}
        onClick={onGoToDetails}>
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={governanceMember?.name}
            src={
              governanceMember?.photo
                ? governanceMember?.photo
                : '/default-placeholder.jpg'
            }
            sx={{ borderRadius: 0.6, height: 100, width: 100 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="column" spacing={0.2} alignItems="center">
              <Typography color="text.primary" fontWeight="medium" fontSize={18}>
                {`${governanceMember?.firstName} ${governanceMember?.lastName}`}
              </Typography>
              <Typography
                component="div"
                variant="caption"
                color="text.secondary"
                fontWeight="regular"
                sx={{
                  color: !lastGovernanceMemberRole?.isActive? 'red': 'initial',
                  fontStyle: !lastGovernanceMemberRole?.isActive? 'italic': 'initial',
                }}
              >
                {lastGovernanceMemberRole?.role!=='OTHER' ? `${getGovernanceRoleLabel(lastGovernanceMemberRole?.role)}` : lastGovernanceMemberRole?.otherRole}
              </Typography>
              <Typography
                component="div"
                variant="caption"
                color="text.secondary"
                fontWeight="regular"
                sx={{ fontStyle: 'italic' }}
              >
                <b>Élu le :</b> {getFormatDate(lastGovernanceMemberRole?.startingDateTime)}<br />
                <b>Fin du mandat le :</b> {getFormatDate(lastGovernanceMemberRole?.endingDateTime)}
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
            <Link
              to={`/online/gouvernance/membres/details/${governanceMember?.id}`}
              className="no_style"
            >
              <MenuItem onClick={handleCloseMenu}>
                <AccountBox fontSize="small" sx={{ mr: 2 }}/>
                Détails
              </MenuItem>
            </Link>
            {canManageGovernance && <>{governanceMember?.folder && (
              <OpenLibraryButton
                folderParent={governanceMember?.folder}
                apparence="menuItem"
                title="Bibliothèque"
                onAfterClick={handleCloseMenu}
              />
            )}
            <Link
              to={`/online/gouvernance/membres/modifier/${governanceMember?.id}`}
              className="no_style"
            >
              <MenuItem onClick={handleCloseMenu}>
                <Edit fontSize="small" sx={{ mr: 2 }}/>
                Modifier
              </MenuItem>
            </Link>
            <MenuItem
              onClick={() => {
                onUpdateGovernanceMemberFields({ variables: {id: governanceMember?.id, governanceMemberData: {isArchived: !governanceMember?.isArchived}} });
                handleCloseMenu();
              }}
            >
              {governanceMember?.isArchived ? <Unarchive sx={{ mr: 2 }} /> : <Archive sx={{ mr: 2 }} />}
              {governanceMember?.isArchived ? 'Restaurer' : 'Archiver'}
            </MenuItem>
            {onDeleteGovernanceMember && (
              <MenuItem
                onClick={() => {onDeleteGovernanceMember(governanceMember?.id); handleCloseMenu()}}
              >
                <Delete fontSize="small" sx={{ mr: 2 }}/>
                Supprimer
              </MenuItem>
            )}</>}
          </Popover>
      </Stack>
    </Card>
  );
}
