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
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  getaccountTypeLabel,
  formatCurrencyAmount,
} from '../../../../_shared/tools/functions';

export default function SceBenefitItemCard({
  sceBenefit,
  onDeleteSceBenefit,
  onUpdateSceBenefitState,
}) {
  //   const theme = useTheme();
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

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
      `/online/cse/avantages/details/${sceBenefit?.id}`,
    );
  };
  return (
    <Card variant="outlined" sx={{ position: 'relative', p: 4 }}>
      <Tooltip title={sceBenefit?.name}>
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
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="column" spacing={0.2} alignItems="center">
              <Typography
                color="text.primary"
                fontWeight="medium"
                fontSize={18}
              >
                {`${sceBenefit?.title}`}
              </Typography>
              <Typography
                component="div"
                variant="caption"
                color="text.secondary"
                fontWeight="regular"
              >
                {stripHtml(sceBenefit?.content).slice(0, 100)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Tooltip>
      <Stack
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
          {onDeleteSceBenefit && (
            <Tooltip title="Supprimer">
              <MenuItem
                onClick={() => {
                  onDeleteSceBenefit(sceBenefit?.id);
                  handleCloseMenu();
                }}
              >
                <Delete fontSize="small" />
                Supprimer
              </MenuItem>
            </Tooltip>
          )}
          {onUpdateSceBenefitState && (
            <Tooltip title={!sceBenefit?.isActive ? 'Activer' : 'Désactiver'}>
              <MenuItem
                aria-label={!sceBenefit?.isActive ? 'play' : 'pause'}
                onClick={() => {
                  onUpdateSceBenefitState(sceBenefit?.id);
                  handleCloseMenu();
                }}
              >
                {!sceBenefit?.isActive ? (
                  <PlayArrowRounded />
                ) : (
                  <PauseRounded />
                )}
                {!sceBenefit?.isActive ? 'Activer' : 'Désactiver'}
              </MenuItem>
            </Tooltip>
          )}
          <Tooltip title="Modifier">
            <Link
              to={`/online/cse/avantages/modifier/${sceBenefit?.id}`}
              className="no_style"
            >
              <MenuItem onClick={handleCloseMenu}>
                <Edit fontSize="small" />
                Modifier
              </MenuItem>
            </Link>
          </Tooltip>
          {sceBenefit?.folder && (
            <Tooltip title="Pièces jointes">
              <MenuItem
                onClick={() => {
                  onOpenDialogListLibrary(sceBenefit?.folder);
                  handleCloseMenu();
                }}
              >
                <Folder fontSize="small" />
                Pièces jointes
              </MenuItem>
            </Tooltip>
          )}
          <Tooltip title="Détails">
            <Link
              to={`/online/cse/avantages/details/${sceBenefit?.id}`}
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
