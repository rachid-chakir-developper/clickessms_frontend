import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, Chip, MenuItem, Popover, Stack, Tooltip } from '@mui/material';
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
import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../../../_shared/context/AuthorizationSystemProvider';

export default function ContractTemplateItemCard({
  contractTemplate,
  onDeleteContractTemplate,
  onUpdateContractTemplateState,
}) {
  const authorizationSystem = useAuthorizationSystem();
  const canManageSceModules = authorizationSystem.requestAuthorization({
    type: 'manageSceModules',
  }).authorized;
  //   const theme = useTheme();
  // Function to strip HTML tags
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Extract the content, strip HTML, and truncate to 100 characters

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
  const onGoToDetails = () => {
    navigate(
      `/online/ressources-humaines/employes/contrats/templates/details/${contractTemplate?.id}`,
    );
  };
  return (
    <Card variant="outlined" sx={{ position: 'relative', p: 1 }}>
      <Tooltip title={contractTemplate?.name}>
        <Stack
          direction="row"
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
          }}
          onClick={onGoToDetails}
        >
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={contractTemplate?.name}
            src={
              contractTemplate?.image
                ? contractTemplate?.image
                : '/default-placeholder.jpg'
            }
            sx={{ borderRadius: 0.6, height: 100, width: 100 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="column" spacing={0.2} alignItems="center">
              <Typography
                color="text.primary"
                fontWeight="medium"
                fontSize={18}
              >
                {contractTemplate?.title}
              </Typography>
              <Typography
                component="div"
                variant="caption"
                color="text.secondary"
                fontWeight="regular"
              >
                {contractTemplate?.contractType}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Tooltip>
      {canManageSceModules && <Stack
        direction="row"
        alignItems="start"
        spacing={1.5}
        sx={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}
      >
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
          {onDeleteContractTemplate && (
            <Tooltip title="Supprimer">
              <MenuItem
                onClick={() => {
                  onDeleteContractTemplate(contractTemplate?.id);
                  handleCloseMenu();
                }}
              >
                <Delete fontSize="small" />
                Supprimer
              </MenuItem>
            </Tooltip>
          )}
          {onUpdateContractTemplateState && (
            <Tooltip title={!contractTemplate?.isActive ? 'Activer' : 'Désactiver'}>
              <MenuItem
                aria-label={!contractTemplate?.isActive ? 'play' : 'pause'}
                onClick={() => {
                  onUpdateContractTemplateState(contractTemplate?.id);
                  handleCloseMenu();
                }}
              >
                {!contractTemplate?.isActive ? (
                  <PlayArrowRounded />
                ) : (
                  <PauseRounded />
                )}
                {!contractTemplate?.isActive ? 'Activer' : 'Désactiver'}
              </MenuItem>
            </Tooltip>
          )}
          <Tooltip title="Modifier">
            <Link
              to={`/online/ressources-humaines/employes/contrats/templates/modifier/${contractTemplate?.id}`}
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
              to={`/online/ressources-humaines/employes/contrats/templates/details/${contractTemplate?.id}`}
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
