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
import { getWorkflowRequestTypeLabel } from '../../../../_shared/tools/functions';

export default function ValidationWorkflowItemCard({
  validationWorkflow,
  onDeleteValidationWorkflow,
  onUpdateValidationWorkflowState,
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
    navigate(`/online/parametres/workflows/modifier/${validationWorkflow?.id}`);
  }
  return (
    <Card
      variant="outlined"
      sx={{ position: 'relative', p: 1}}
    >
      <Tooltip title={getWorkflowRequestTypeLabel(validationWorkflow?.requestType)}>
        <Stack direction="row"
        sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2, cursor:'pointer' }}
        onClick={onGoToDetails}>
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={getWorkflowRequestTypeLabel(validationWorkflow?.requestType)}
            src={'/default-placeholder.jpg'}
            sx={{ borderRadius: 0.6, height: 100, width: 100 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="column" spacing={0.2} alignItems="center">
            <Typography color="text.primary" fontWeight="medium" fontSize={18}>
              {getWorkflowRequestTypeLabel(validationWorkflow?.requestType)}
            </Typography>
            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
              fontWeight="regular"
            >
              Worflow pour: {getWorkflowRequestTypeLabel(validationWorkflow?.requestType)}
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
            {onDeleteValidationWorkflow && (
              <Tooltip title="Supprimer">
                <MenuItem
                  onClick={() => {onDeleteValidationWorkflow(validationWorkflow?.id); handleCloseMenu()}}
                >
                  <Delete fontSize="small" />
                  Supprimer
                </MenuItem>
              </Tooltip>
            )}
            {/* {onUpdateValidationWorkflowState && (
              <Tooltip
                title={!validationWorkflow?.isActive ? 'Activer' : 'Désactiver'}
              >
                <MenuItem
                  aria-label={!validationWorkflow?.isActive ? 'play' : 'pause'}
                  onClick={() => {onUpdateValidationWorkflowState(validationWorkflow?.id); handleCloseMenu()}}
                >
                  {!validationWorkflow?.isActive ? (
                    <PlayArrowRounded />
                  ) : (
                    <PauseRounded />
                  )}
                  {!validationWorkflow?.isActive ? 'Activer' : 'Désactiver'}
                </MenuItem>
              </Tooltip>
            )} */}
            <Tooltip title="Modifier">
              <Link
                to={`/online/parametres/workflows/modifier/${validationWorkflow?.id}`}
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
                to={`/online/parametres/workflows/modifier/${validationWorkflow?.id}`}
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
